from BulbController import BulbController
import time
import os

BROKER_ADDRESS = os.environ['BROKER_ADDRESS']
BROADCAST_SPACE = os.environ['BROADCAST_SPACE']


def exit_handler(controller):
    client = controller.get_client()
    client.publish("house/status", "OFFLINE")
    time.sleep(0.1)
    print('Done')


def main():
    controller = BulbController(BROADCAST_SPACE, BROKER_ADDRESS)
    try:
        while True:
            time.sleep(0.1)
    finally:
        exit_handler(controller)


if __name__ == '__main__':
    main()




#
# atexit.register(exit_handler)
