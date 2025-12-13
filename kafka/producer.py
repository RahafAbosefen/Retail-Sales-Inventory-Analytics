from kafka import KafkaProducer
import csv
import json
import time

BOOTSTRAP_SERVERS = "localhost:9092"
TOPIC_NAME = "first-topic"

producer = KafkaProducer(
    bootstrap_servers=BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

CSV_FILE_PATH = "../data/Items-bigdata.csv"

print("Starting Kafka Producer...")

with open(CSV_FILE_PATH, mode="r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        producer.send(TOPIC_NAME, value=row)
        print(f"Sent: {row}")
        time.sleep(1)

producer.flush()
producer.close()

print("Kafka Producer finished sending data.")
