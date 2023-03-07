const mqtt = require("mqtt");
const cors = require("cors");
// const Influx = require("influx");

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

// MQTT settings
const mqttBrokerUrl = `mqtt://${process.env.BROKER_ADDRESS}:${process.env.BROKER_PORT}`;
const mqttTopic = "house/bulb/+";

// InfluxDB settings
const influxHost = process.env.INFLUXDB_URL;
const bucket = process.env.INFLUXDB_BUCKET;
const org = process.env.INFLUXDB_ORG;
const token = process.env.INFLUXDB_TOKEN;

const influx = new InfluxDB({ url: influxHost, token });

const writeApi = influx.getWriteApi(org, bucket);

const express = require("express");
const app = express();
const port = process.env.NODEJS_PORT;

// Connect to MQTT broker
const client = mqtt.connect(mqttBrokerUrl);

client.on("connect", function () {
  console.log("Connected to MQTT broker");

  // Subscribe to MQTT topic
  client.subscribe(mqttTopic, function (err) {
    if (err) {
      console.log("Error subscribing to MQTT topic:", err);
    } else {
      console.log("Subscribed to MQTT topic:", mqttTopic);
    }
  });
});

let bulbs = [];

// Process MQTT messages
client.on("message", function (topic, message) {
  const value = message.toString();
  console.log("message check me for crash data", value);
  if (value) {
    const jsonData = JSON.parse(value);

    bulbs.push(jsonData);

    const point = new Point("bulb")
      .tag("bulb_ip", jsonData.ip)
      .stringField("state", jsonData.state);

    writeApi.writePoint(point);
  }
});

// Check MQTT topic every 5 minutes
setInterval(function () {
  checkMQTTStatus();
}, 5 * 60 * 1000);

function checkMQTTStatus() {
  console.log("Checking MQTT topic...");

  // Publish MQTT message to trigger a response
  const data = { command: "STATUS" };
  bulbs = [];
  client.publish("house/command", JSON.stringify(data));
}

function getBulbs() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (bulbs.length > 0) {
        clearInterval(interval);
        resolve(bulbs);
      }
    }, 1000);
  });
}

app.get("/api/bulbs", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  checkMQTTStatus();
  try {
    const data = await getBulbs();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/bulbs/:id/:state", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id, state } = req.params;
  console.log("request", id, state);
  const data = { command: state, ID: id };
  bulbs = [];
  console.log("data!", data);
  client.publish("house/command", JSON.stringify(data));

  try {
    const data = await getBulbs();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  // setTimeout(function () {
  //   res.json({ data: bulbs });
  // }, 500);
});

// Allow requests from any origin
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
