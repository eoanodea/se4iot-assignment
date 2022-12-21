from BulbController import BulbController
import time


BROADCAST_SPACE = "192.168.159.255"


def exit_handler(controller):
    client = controller.get_client()
    client.publish("house/status", "OFFLINE")
    time.sleep(0.1)
    print('Done')


def main():
    controller = BulbController(BROADCAST_SPACE)
    try:
        while True:
            time.sleep(0.1)
    finally:
        exit_handler(controller)


if __name__ == '__main__':
    main()




#
# atexit.register(exit_handler)
