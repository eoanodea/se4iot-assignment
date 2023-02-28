const mqtt = require("mqtt");
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

// Process MQTT messages
client.on("message", function (topic, message) {
  const value = message.toString();
  const jsonData = JSON.parse(value);

  console.log("Received MQTT message:", value);

  // Write data to InfluxDB
  const point = new Point("bulb")
    .tag("bulb_ip", jsonData.ip)
    .stringField("state", jsonData.state);

  writeApi.writePoint(point);
});

// Check MQTT topic every 5 minutes
setInterval(function () {
  console.log("Checking MQTT topic...");

  // Publish MQTT message to trigger a response
  const data = { command: "STATUS" };

  client.publish("house/command", JSON.stringify(data));
}, 5 * 60 * 1000);
// }, 3000);
