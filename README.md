# Audit Event Ingestion Service

This service is responsible for receiving audit events and sending them as messages to Message Queue.


## Getting Started

### Setup Kafka Docker Container

Pull Docker image 
<br>
<code>
    docker pull apache/kafka:4.1.0
</code>

Run container
<br>
<code>
    docker run -p 9092:9092 apache/kafka:4.1.0
</code>

### Start Ingestion Service Locally
Install dependancies
<br>
<code>npm install .</code>
<br>

Start the service
<br>
<code>npm run start </code>




