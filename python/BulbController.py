import asyncio
import json
import paho.mqtt.client as mqtt

from Bulb import Bulb
from pywizlight import wizlight, PilotBuilder, discovery
from typing import Any


class BulbController:
    _broadcast_space: str
    _broadcast_address: str
    _client: Any
    _bulbs: list

    def __init__(self, broadcast_space, broadcast_address) -> None:
        super().__init__()
        self._bulbs = []
        self._broadcast_space = broadcast_space
        self._broadcast_address = broadcast_address

        self._client = mqtt.Client("BulbController")
        self._client.connect(broadcast_address, 1883, 60)

        self._client.subscribe("house/bulbs")
        self._client.on_message = self.on_message

        self._client.loop_start()
        print("Ready")
        self._client.publish("house/status", "READY")

    def get_client(self):
        return self._client

    def init_bulb_status(self):
        self.publish_status()

    def on_message(self, client, userdata, message):
        self._client.publish("house/status", "HEY")
        try:
            parsed_json = json.loads(message.payload)
            print(parsed_json)
        except Exception as err:
            print("could not read message")
            print(err)

        if parsed_json is not None and 'command' in parsed_json:
            asyncio.run(self.publish_status())

    async def publish_status(self):
        self._client.publish("house/status", "BUSY")

        bulbs = await self.discover_bulbs()
        if len(bulbs) == 0:
            self._client.publish("house/status", "READY")
            self._client.publish("house/bulbs/info", "No bulbs found")
        else:
            for index, bulb in enumerate(bulbs):
                self._bulbs.append(Bulb(index, bulb['ip']))
                self._client.publish("house/bulb/" + str(index), "OFF")
            else:
                self._client.publish("house/status", "READY")

    async def discover_bulbs(self):
        # bulbs = await discovery.discover_lights(broadcast_space=self._broadcast_space)

        file = open('mock-data.json')
        data = json.load(file)

        print(data)

        bulbs = data
        return bulbs

    # async def turn_on_bulb(self, ip_address):
    #     light = wizlight(ip_address)

    #     try:
    #         await light.turn_on(PilotBuilder(brightness=255, warm_white=255))
    #         return True;
    #     except Exception as err:
    #         print("Error turning on bulb" + err)
    #         return False;

    # async def turn_off_bulb(self, ip_address):
    #     light = wizlight(ip_address)
    #     try:
    #         await light.turn_off()
    #         return True;
    #     except Exception as err:
    #         print("Error turning off bulb" + err)
    #         return False
