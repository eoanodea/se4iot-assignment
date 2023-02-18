from typing import Any

from BulbEnums import BulbState
from pywizlight import wizlight


class Bulb:
    _id: int
    _ip_address: str
    _state: BulbState
    _client: Any

    def __init__(self, id, ip_address):
        self._id = id
        self._ip_address = ip_address
        self._state = BulbState.OFF
        self._client = wizlight(ip_address)
    
    async def turn_on(self, config):
        try:
            await self._client.turn_on(config)
            self._state = BulbState.ON
            return True;
        except Exception as err:
            print("Error turning on bulb" + err)
            return False;

    async def turn_off(self):
        try:
            await self._client.turn_off()
            self._state = BulbState.OFF
            return True;
        except Exception as err:
            print("Error turning on bulb" + err)
            return False;