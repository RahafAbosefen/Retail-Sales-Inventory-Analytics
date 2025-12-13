# Kafka Commands Documentation

This document describes the Kafka setup and commands used in the
**Retail Sales Inventory Analytics** project.

Kafka is used as a streaming platform to deliver inventory data
to Spark Streaming for real-time processing.

---

## 1. Start Zookeeper
Zookeeper is required to manage Kafka brokers.
```bash
bin/windows/zookeeper-server-start.bat config/zookeeper.properties 
```
## 2. Start Kafka Broker
After starting Zookeeper, the Kafka broker is started.
```bash
bin/windows/kafka-server-start.bat config/server.properties
```
## 3. Create Kafka Topic
A topic named first-topic is created to stream inventory data.
```bash
bin/windows/kafka-topics.bat --create ^
--topic first-topic ^
--bootstrap-server localhost:9092 ^
--partitions 1 ^
--replication-factor 1
```
## 4. List Available Topics
This command is used to verify that the topic was created successfully.
```bash
bin/windows/kafka-topics.bat --list --bootstrap-server localhost:9092
```
## 5. Start Kafka Console Producer (Test)
The console producer is used to manually send test messages.
```bash
bin/windows/kafka-console-producer.bat ^
--broker-list localhost:9092 ^
--topic first-topic
```
## 6. Start Kafka Console Consumer (Test)
The console consumer is used to verify that messages are received correctly.
```bash
bin/windows/kafka-console-consumer.bat ^
--bootstrap-server localhost:9092 ^
--topic first-topic ^
--from-beginning
```