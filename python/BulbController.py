from pywizlight import wizlight, PilotBuilder, discovery
from typing import Any
import json
import paho.mqtt.client as mqtt

BROKER_ADDRESS = "localhost"


class BulbController:
    _broadcast_space: str
    _client: Any

    def __init__(self, broadcast_space) -> None:
        super().__init__()
        self._broadcast_space = broadcast_space

        self._client = mqtt.Client("BulbController")
        self._client.connect(BROKER_ADDRESS)
        self._client.subscribe("house/bulbs")
        self._client.on_message = self.on_message
        # self._client.publish("house/main-light", "OFF")
        self._client.loop_start()

    def on_message(self, client, userdata, message):
        print("MESSAGE")
        parsedJson = json.loads(message.payload)
        print(parsedJson)
        if parsedJson["command"] == "status":
            self.publish_status()

    async def publish_status(self):
        bulbs = await self.discover_bulbs()
        for index, bulb in enumerate(bulbs):
            self._client.publish("house/bulb" + index, "OFF")

    async def discover_bulbs(self):
        bulbs = await discovery.discover_lights(broadcast_space=self._broadcast_space)
        print("yes")
        for bulb in bulbs:
            print(bulb.__dict__)

        return bulbs

    async def turn_on_bulb(self, ip_address):
        light = wizlight(ip_address)
        print("light")
        try:
            await light.turn_on(PilotBuilder(brightness=255, warm_white=255))
            return True;
        except Exception as err:
            print("Error turning on bulb" + err)
            return False;

    async def turn_off_bulb(self, ip_address):
        light = wizlight(ip_address)
        try:
            await light.turn_off()
            return True;
        except Exception as err:
            print("Error turning off bulb" + err)
            return False;


class Bulb:
    _ip_address: str

    def __init__(self, ip_address) -> None:
        self._ip_address = ip_address
