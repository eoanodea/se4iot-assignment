import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";

const SERVER_URL = `${GlobalConfig.server_url}:${GlobalConfig.server_port}`;

const bulbService = {
  getAll: async () => {
    const res = await axios.get(SERVER_URL + "/api/status", {});

    return res.data;
  },
};

export default bulbService;
