# 💡 Software Engineering for IoT devices

## ✏️ Description

Coming soon :))

### ✉️ Available commands

A list of available commands that you can send through MQTT to the Bulb Controller
| Topic | JSON Data | Description |
|-----------------|--------------------------------|---------------------------------------------------------------|
| `house/command` | `{"command": "STATUS"}` | Checks the local network for available bulbs and their status |
| `house/command` | `{"command": "ON", "ID": 1 }` | Turn on a bulb by it's ID |
| `house/command` | `{"command": "OFF", "ID": 1 }` | Turn off a bulb by it's ID |

## 🤔 How to run this code

1. Make sure you have [docker & docker-compose](https://docs.docker.com/get-docker/) installed
2. Clone this repository to your local machine and `cd` into it
3. Run `cp example.env .env` and fill in any new values in the new `.env` file
4. Run `docker-compose up` (might take a little while on your first run)

## ✅ Todo

- [x] Basic communication between Python & MQTT
- [ ] A good plan 🙃
- [ ] Simulated data for graph (time light is on / off, maybe usage over a day/month/year etc)
- [ ] Dashboard to control stuff ([openhab](https://www.openhab.org/))
- [ ] Options to add more bulbs
- [ ] CRON server (Node.js)
- [ ] Google Cal integration
