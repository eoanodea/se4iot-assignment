import json
import os
from typing import Any

from BulbEnums import BulbState
from pywizlight import wizlight

APP_ENV = os.environ['APP_ENV']


class Bulb:
    _id: int
    _ip_address: str
    _state: BulbState
    _client: Any

    def __init__(self, index, ip_address):
        self._id = index
        self._ip_address = ip_address
        self._state = BulbState.OFF
        self._client = wizlight(ip_address)

    def build_data(self):
        bulb_data = {
            'id': self._id,
            'ip': self._ip_address,
            'state': self._state.value
        }
        json_data = json.dumps(bulb_data, indent=4)
        return json_data

    async def turn_on(self, config):
        try:
            if ENV == "production":
                await self._client.turn_on(config)
            self._state = BulbState.ON
            return True;
        except Exception as err:
            print("Error turning on bulb" + err)
            return False;

    async def turn_off(self):
        try:
            if ENV == "production":
                await self._client.turn_off()
            self._state = BulbState.OFF
            return True;
        except Exception as err:
            print("Error turning on bulb" + err)
            return False;
