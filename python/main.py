from BulbController import BulbController
import time

BROADCAST_SPACE = "192.168.159.255"


def main():
    BulbController(BROADCAST_SPACE)

    while True:
        time.sleep(0.1)
    print("done")
