from kafka import KafkaProducer
import csv
import json
import time
import random
from datetime import datetime, timezone
from pathlib import Path

BOOTSTRAP_SERVERS = "localhost:9092"
TOPIC_NAME = "first-topic"

CSV_FILE_PATH = Path(__file__).resolve().parent.parent / "data" / "Items-bigdata.csv"

producer = KafkaProducer(
    bootstrap_servers=BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v, ensure_ascii=False).encode("utf-8"),
    acks="all",
    retries=5,
    linger_ms=50
)

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def safe_int(v, default=0):
    try:
        return int(float(v))
    except Exception:
        return default

def pick_item_id(row: dict) -> str:
    for k in ["ItemId", "itemId", "item_id", "ID", "Id", "id", "SKU", "sku"]:
        if k in row and str(row[k]).strip():
            return str(row[k]).strip()
    if row:
        first_key = list(row.keys())[0]
        return str(row.get(first_key, "unknown")).strip()
    return "unknown"

def build_event(row: dict) -> dict:
    item_id = pick_item_id(row)

    current_stock = None
    for k in ["Stock", "stock", "Quantity", "quantity", "Qty", "qty", "OnHand", "onHand"]:
        if k in row and str(row[k]).strip():
            current_stock = safe_int(row[k], default=0)
            break

    event_type = random.choices(["SALE", "RESTOCK"], weights=[0.75, 0.25])[0]
    qty = random.randint(1, 5)

    delta = -qty if event_type == "SALE" else qty

    event = {
        "event_time": now_iso(),
        "event_type": event_type,
        "item_id": item_id,
        "delta_qty": delta,
        "source": "csv-simulator",
        "item": row,
    }

    if current_stock is not None:
        event["reported_stock"] = current_stock

    return event

def main():
    if not CSV_FILE_PATH.exists():
        raise FileNotFoundError(f"CSV file not found: {CSV_FILE_PATH}")

    print(f"Starting Kafka Producer -> topic: {TOPIC_NAME}")
    print(f"Reading CSV from: {CSV_FILE_PATH}")

    with open(CSV_FILE_PATH, mode="r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        print("CSV is empty. Nothing to stream.")
        return

    i = 0
    try:
        while True:
            row = rows[i % len(rows)]
            event = build_event(row)

            future = producer.send(TOPIC_NAME, value=event)
            metadata = future.get(timeout=10)
            print(f"Sent -> partition={metadata.partition}, offset={metadata.offset}, event={event['event_type']}, item_id={event['item_id']}, delta={event['delta_qty']}")

            i += 1
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nStopped by user (Ctrl+C).")
    finally:
        producer.flush()
        producer.close()
        print("Producer closed.")

if __name__ == "__main__":
    main()
