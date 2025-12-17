import os
import sys
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, when, udf, lit, current_timestamp
from pyspark.sql.types import StructType, StructField, StringType, IntegerType
from pybloom_live import BloomFilter

# إعدادات بيئة ويندوز لضمان عمل السبارك
os.environ['PYSPARK_PYTHON'] = sys.executable
os.environ['PYSPARK_DRIVER_PYTHON'] = sys.executable

# 1. إعداد الـ Bloom Filter للمنتجات المتميزة
premium_products_bf = BloomFilter(capacity=1000, error_rate=0.1)
premium_ids = ["641", "643"]
for pid in premium_ids:
    premium_products_bf.add(pid)

@udf(returnType=StringType())
def check_premium(item_id):
    return "💎 Premium" if item_id in premium_products_bf else "Standard"

# إعداد جلسة السبارك مع الحزم اللازمة للربط
spark = SparkSession.builder \
    .appName("RetailInventoryAnalytics") \
    .config("spark.mongodb.output.uri", "mongodb://127.0.0.1/inventory_db.alerts") \
    .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1,org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2") \
    .getOrCreate()

# 2. استقبال البيانات من Kafka
df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "first-topic") \
    .load()

schema = StructType([
    StructField("item_id", StringType()),
    StructField("event_type", StringType()),
    StructField("reported_stock", IntegerType())
])

# إضافة التوقيت الزمني الحالي واستخدام Watermarking للتعامل مع البيانات المتأخرة
processed_df = df.selectExpr("CAST(value AS STRING)") \
    .select(from_json(col("value"), schema).alias("data")) \
    .select("data.*") \
    .withColumn("timestamp", current_timestamp()) \
    .withWatermark("timestamp", "10 minutes")

# --- ثوابت معادلة إعادة الطلب (Inventory Management Constants) ---
LEAD_TIME = 2
SAFETY_STOCK = 20
AVG_DAILY_SALE = 15
REORDER_POINT = (AVG_DAILY_SALE * LEAD_TIME) + SAFETY_STOCK

# 3. معالجة البيانات وإضافة منطق التنبيهات والاقتراحات
final_df = processed_df.withColumn("Status",
                                   when(col("reported_stock") < lit(50), "⚠️ LOW STOCK ALERT")
                                   .when(col("reported_stock") > lit(1000), "📢 OVERSTOCK WARNING")
                                   .otherwise("Normal")
                                   ).withColumn("Behavior",
                                                when((col("event_type") == lit("SALE")) & (col("reported_stock") < lit(10)), "🚨 ANOMALOUS BEHAVIOR")
                                                .otherwise("Steady")
                                                ).withColumn("Product_Tier", check_premium(col("item_id"))) \
    .withColumn("Suggested_Order_Qty",
                when(col("reported_stock") <= lit(REORDER_POINT), lit(AVG_DAILY_SALE * 7))
                .otherwise(0)
                )

# 4. دالة الحفظ لـ MongoDB
def write_to_mongo(batch_df, batch_id):
    batch_df.write \
        .format("com.mongodb.spark.sql.DefaultSource") \
        .option("database", "inventory_db") \
        .option("collection", "alerts") \
        .mode("append") \
        .save()

# تشغيل عمليات البث مع إضافة ميزة Checkpointing لضمان Fault Tolerance
query = final_df.writeStream \
    .foreachBatch(write_to_mongo) \
    .option("checkpointLocation", "C:/bigdata/checkpoints") \
    .start()

console_query = final_df.writeStream \
    .outputMode("append") \
    .format("console") \
    .start()

query.awaitTermination()
console_query.awaitTermination()