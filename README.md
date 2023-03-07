# 💡 Software Engineering for IoT devices

## ✏️ Description

Coming soon :))

## ✉️ Available commands

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
   - Use `APP_ENV=development` for a simulated version of the app
   - Use `APP_ENV=production` for a physical version of the app
4. Run `docker-compose up` (might take a little while on your first run)

## ✅ Todo

- [x] Basic communication between Python & MQTT
- [x] Bulb Controller functionality (`STATUS`, `ON`, `OFF`)
- [x] A good plan 🙃
- [x] Simulated data for graph (time light is on / off, maybe usage over a day/month/year etc)
- [ ] Dashboard to control stuff ([openhab](https://www.openhab.org/))
- [x] CRON server (Node.js)
