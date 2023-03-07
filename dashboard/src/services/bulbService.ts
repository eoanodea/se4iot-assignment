import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IBulb } from "../interfaces";

const SERVER_URL = `${GlobalConfig.server_url}:${GlobalConfig.server_port}`;

const bulbService = {
  getAll: async (): Promise<IBulb[]> => {
    const response = await axios.get(SERVER_URL + "/api/status", {});

    return response.data.data;
  },
};

export default bulbService;
