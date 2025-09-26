import express from 'express'
import { Kafka } from 'kafkajs';

const app = express();
const port = 3000

// middleware to parse JSON request body
app.use(express.json());

// Check status of service
app.get('/health', (req, res) => {
    return res.json({
        status: "up"
    })
})

// ingest an audit event
app.post("/api/v1/audit-event", async (req, res) => {
    const event = {
        userId: req.body?.userId ?? 0,
        tenantId: req.body?.tenantId ?? 0,
        eventType: req.body?.eventType ?? "UNKNOWN",
        action: req.body?.action ?? "unknown.unknown",
        permitted: req.body?.permitted ?? true,
        recievedTimestamp: Date.now()
    }

    // Send message to queue
    const producer = new Kafka({
        clientId: 'audit-event-ingestion-service',
       brokers: [process.env.KAFKA_BROKER || 'kafka:9092' || 'localhost:9092']

    }).producer();

    await producer.connect();

    const deliveryReports = await producer.send({
        topic: 'audit-event-topic',
        messages: [
            {
                key: event.userId.toString(), 
                value: JSON.stringify(event) 
            }
        ]
    });

    // collect logs/metrics around delivery
    console.log({deliveryReports});
    producer.disconnect();

    return res.json(event);
})

app.listen(port, () => {
  console.log(`Audit Event Ingestion Service listening on port ${port}`)
})