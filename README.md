# 💡 Software Engineering for IoT devices

## ✏️ Description

This application allows you to search for and control [Wiz Lights](https://www.wizconnected.com/en-us) within your local network using the [pywizlight](https://github.com/sbidy/pywizlight) python library.

It contains a stack of docker containers that do the following:

1. `sample-data` - Used to generate sample data to be stored in `influxdb` and to be displayed on a graph on the `dashboard`
2. `python` - Utilises the `pywizlight` library to discover available bulbs in your local network, and control them. It publishes the data to the `mqtt` message broker and subscribes to a topic on it awaiting commands.
3. `mqtt` - Mosquitto message broker used by both `python` and `nodejs`. Makes topics available to be subscribed to and to publish.
4. `influxdb` - Used to store usage data of the bulbs. Data includes a bulb's state (`ON` or `OFF`), the start time, the end time and the IP address of the bulb.
5. `nodejs` - Creates a RESTful API where any client can send the following requests

   - `GET /api/bulbs` - get all available bulbs
   - `PATCH /api/bulbs/:id/:state` - change the state of a bulb by its ID (e.g. `ON` or `OFF`)
   - `GET /api/graph` - get all data from `influxdb`

   The `nodejs` app will also check `mqtt` every 5 minutes for the current states of the bulbs, which will be written to `influxdb` for data analysis

6. `dashboard` - a React.js app written in TypeScript that allows you to:
   - See all available bulbs in a user-friendly dashboard
   - Switch a bulb `ON` or `OFF`
   - View usage data of all bulbs over the last 30 days

## ✉️ Available commands

A list of available commands that you can send through MQTT to the Bulb Controller
| Topic | JSON Data | Description |
|-----------------|--------------------------------|---------------------------------------------------------------|
| `house/command` | `{"command": "STATUS"}` | Checks the local network for available bulbs and their status |
| `house/command` | `{"command": "ON", "ID": 1 }` | Turn on a bulb by its ID |
| `house/command` | `{"command": "OFF", "ID": 1 }` | Turn off a bulb by its ID |

## 🤔 How to run this code

1. Make sure you have [docker & docker-compose](https://docs.docker.com/get-docker/) installed
2. Clone this repository to your local machine and `cd` into it
3. Run `cp example.env .env` and fill in any new values in the new `.env` file
   - Use `APP_ENV=development` for a simulated version of the app
   - Use `APP_ENV=production` for a physical version of the app
4. Run `docker-compose up` (might take a little while on your first run)
5. Create an API token within `influxdb` and fill it in the `.env` file.

## ✅ Todo

- [x] Basic communication between Python & MQTT
- [x] Bulb Controller functionality (`STATUS`, `ON`, `OFF`)
- [x] A good plan 🙃
- [x] Simulated data for graph (time light is on / off, maybe usage over a day/month/year etc)
- [x] Dashboard to control stuff ([openhab](https://www.openhab.org/))
- [x] CRON server (Node.js)
