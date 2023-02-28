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

    def __init__(self, broadcast_space, broker_address, broker_port) -> None:
        super().__init__()
        self._bulbs = []
        self._broadcast_space = broadcast_space
        print('here is port', broker_port)
        self._client = mqtt.Client("BulbController")
        self._client.connect(broker_address, int(broker_port), 60)

        self._client.subscribe("house/command")
        self._client.on_message = self.on_message

        self._client.loop_start()
        print("Ready")
        self._client.publish("house/status", "READY")

    def get_client(self):
        return self._client

    def init_bulb_status(self):
        self.publish_status()

    def on_message(self, client, userdata, message):
        self._client.publish("house/status", "BUSY")

        try:
            parsed_json = json.loads(message.payload)
            print(parsed_json)

            if parsed_json is not None and 'command' in parsed_json:
                if parsed_json['command'] == 'STATUS':
                    asyncio.run(self.publish_status())
                elif parsed_json['command'] == 'ON' or parsed_json['command'] == 'OFF':
                    if 'ID' in parsed_json:
                        asyncio.run(self.update_bulb_state(parsed_json['ID'], parsed_json['command']))
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
        self._client.publish("house/status", "BUSY")

        bulbs = await self.discover_bulbs()
        if len(bulbs) == 0:
            self._client.publish("house/status", "READY")
            self._client.publish("house/message", "No bulbs found")
        else:
            for index, bulb in enumerate(bulbs):
                new_bulb = Bulb(index, bulb['ip'])
                self._bulbs.append(new_bulb)

                json_data = new_bulb.build_data()
                self._client.publish("house/bulb/" + str(index), json_data)
            else:
                self._client.publish("house/status", "READY")

    async def update_bulb_state(self, index, state):

        try:
            bulb = self._bulbs[index]

            if state == "ON":
                config = PilotBuilder(brightness=255, warm_white=255)
                await bulb.turn_on(config)
            else:
                await bulb.turn_off()

            json_data = bulb.build_data()
            self._client.publish("house/bulb/" + str(index), json_data)

        except Exception as err:
            print("could not update bulb state")
            print(err)
            self._client.publish("house/status", "READY")
            self._client.publish("house/message", err.__str__())

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
