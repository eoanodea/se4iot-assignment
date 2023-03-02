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
  const jsonData = JSON.parse(value);
  // const currentIndex = bulbs.findIndex(bulb => bulb.id == jsonData.id)
  // if(currentIndex === -1) {
  bulbs.push(jsonData);
  // }
  console.log("Received MQTT message:", value);

  // Write data to InfluxDB
  const point = new Point("bulb")
    .tag("bulb_ip", jsonData.ip)
    .stringField("state", jsonData.state);

  writeApi.writePoint(point);
});

// Check MQTT topic every 5 minutes
setInterval(function () {
  checkMQTTStatus();
}, 5 * 60 * 1000);
// }, 3000);

function checkMQTTStatus() {
  console.log("Checking MQTT topic...");

  // Publish MQTT message to trigger a response
  const data = { command: "STATUS" };
  bulbs = [];
  client.publish("house/command", JSON.stringify(data));
}

app.get("/api/status", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  checkMQTTStatus();
  setTimeout(function () {
    res.json({ data: bulbs });
  }, 500);
});

// Allow requests from any origin
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});