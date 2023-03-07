import asyncio
import json
import os

import paho.mqtt.client as mqtt

from Bulb import Bulb
from pywizlight import wizlight, PilotBuilder, discovery
from typing import Any

APP_ENV = os.environ['APP_ENV']
# APP_ENV = "production"


class BulbController:
    _broadcast_space: str
    _broadcast_address: str
    _client: Any
    _bulbs: list

    def __init__(self, broadcast_space, broker_address, broker_port) -> None:
        super().__init__()
        self.loop = asyncio.get_event_loop()
        self._bulbs = []
        self._broadcast_space = broadcast_space

        self._client = mqtt.Client("BulbController")
        self._client.connect(broker_address, int(broker_port), 60)

        self._client.subscribe("house/command")
        self._client.on_message = self.on_message

        self._client.loop_start()
        print("Ready")
        self._client.publish("house/status", "READY")
        self._client.publish("house/message", "")
        self._client.publish("house/bulbs", "")

    def get_client(self):
        return self._client

    def init_bulb_status(self):
        self.publish_status()

    def on_message(self, client, userdata, message):
        self._client.publish("house/status", "BUSY")
        self._client.publish("house/message", "")

        try:
            parsed_json = json.loads(message.payload)
            print(parsed_json)

            if parsed_json is not None and 'command' in parsed_json:
                if parsed_json['command'] == 'STATUS':
                    self.loop.run_until_complete(self.publish_status())

                elif parsed_json['command'] == 'ON' or parsed_json['command'] == 'OFF':
                    if 'ID' in parsed_json:
                        self.loop.run_until_complete(self.update_bulb_state(parsed_json['ID'], parsed_json['command']))
                    else:
                        raise Exception("Command must include an ID for the bulb")
                else:
                    raise Exception("Not a valid command. Please provide a message in JSON format e.g. {\"command\": "
                                    "\"STATUS\"}")

        except Exception as err:
            print("could not read message")
            print(err)
            self._client.publish("house/status", "READY")
            self._client.publish("house/message", err.__str__())

    async def publish_status(self):
        bulbs = await self.discover_bulbs()
        if len(bulbs) == 0:
            self._client.publish("house/status", "READY")
            self._client.publish("house/message", "No bulbs found")
        else:
            for index, bulb in enumerate(bulbs):
                if APP_ENV == 'production':
                    ip = bulb.__getattribute__('ip')
                else:
                    ip = bulb['ip']

                new_bulb = Bulb(index, ip)
                self._bulbs.append(new_bulb)

                json_data = new_bulb.build_data()
                self._client.publish("house/bulb/" + str(index), json_data)
            else:
                self._client.publish("house/status", "READY")
                self._client.publish("house/message", "")

    async def update_bulb_state(self, i, state):
        index = int(i)
        try:
            bulb = self._bulbs[index]

            if state == "ON":
                try:
                    config = PilotBuilder(brightness=255, warm_white=255)
                    await bulb.turn_on(config)
                    json_data = bulb.build_data()
                    self._client.publish("house/bulb/" + str(index), json_data)
                except Exception as err:
                    print("error turning on bulb controller")
            else:
                await bulb.turn_off()
                json_data = bulb.build_data()
                self._client.publish("house/bulb/" + str(index), json_data)

        except Exception as err:
            print("could not update bulb state")
            print(err.__str__())
            self._client.publish("house/status", "READY")
            self._client.publish("house/message", err.__str__())

    async def discover_bulbs(self):
        if APP_ENV == 'production':
            bulbs = await discovery.discover_lights(broadcast_space=self._broadcast_space)
        else:
            file = open('mock-data.json')
            data = json.load(file)

            bulbs = data
        return bulbs
