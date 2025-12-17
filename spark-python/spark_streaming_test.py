from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType

spark = SparkSession.builder \
    .appName("KafkaSparkStreaming-Test") \
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")

# Kafka source
kafka_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "first-topic") \
    .option("startingOffsets", "latest") \
    .load()

# Convert value from bytes to string
json_df = kafka_df.selectExpr("CAST(value AS STRING) as json")

# Schema (مهم)
schema = StructType([
    StructField("event_time", StringType()),
    StructField("event_type", StringType()),
    StructField("item_id", IntegerType()),
    StructField("delta", IntegerType()),
    StructField("item", StructType([
        StructField("Item-Number", StringType()),
        StructField("Item-Name", StringType()),
        StructField("Item-type", StringType()),
        StructField("Purchase Price", StringType()),
        StructField("Selling Price", StringType()),
        StructField("Expiry Date", StringType())
    ]))
])

parsed_df = json_df.select(from_json(col("json"), schema).alias("data"))

final_df = parsed_df.select(
    "data.event_time",
    "data.event_type",
    "data.item_id",
    "data.delta",
    col("data.item.Item-Name").alias("item_name"),
    col("data.item.Item-type").alias("item_type"),
    col("data.item.Selling Price").alias("selling_price")
)

query = final_df.writeStream \
    .outputMode("append") \
    .format("console") \
    .option("truncate", False) \
    .start()

query.awaitTermination()
