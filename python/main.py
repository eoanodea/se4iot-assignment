from BulbController import BulbController

import asyncio
import time

# from pywizlight import wizlight, PilotBuilder, discovery
import paho.mqtt.client as mqtt

BROADCAST_SPACE = "192.168.159.255"


async def main():
    controller = BulbController(BROADCAST_SPACE)

    # bulbs = await controller.discover_bulbs()

    # for bulb in bulbs:
    #     await controller.turn_on_bulb(bulb.ip)
        # await turn_off_bulb(bulb.ip)
    while True:
        time.sleep(0.1)
    print("done")


loop = asyncio.get_event_loop()
loop.run_until_complete(main())
