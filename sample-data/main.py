from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime, timedelta
import random
import os

INFLUXDB_ORG = os.environ['INFLUXDB_ORG']
INFLUXDB_TOKEN = os.environ['INFLUXDB_TOKEN']
INFLUXDB_BUCKET=os.environ['INFLUXDB_BUCKET']
INFLUXDB_URL=os.environ['INFLUXDB_URL']

def main():
    # Instantiate the InfluxDB client
    client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)

    # Get the write API
    write_api = client.write_api(write_options=SYNCHRONOUS)

    # Define the data
    bulb_ip = "192.168.159.102"
    # timestamp = datetime.utcnow()
    now = datetime.utcnow()
    for i in range(50):
        # Randomly set the state to either "ON" or "OFF"
        state = random.choice(["ON", "OFF"])

        timestamp = now - timedelta(minutes=i * 5)
        # Create a new point with a timestamp that is 5 minutes apart
        point = Point("bulb_state").tag("bulb_ip", bulb_ip).field("state", state).time(timestamp)
        write_api.write(bucket=INFLUXDB_BUCKET, record=point)


if __name__ == '__main__':
    main()
