import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IInfluxDBData } from "../interfaces";

const SERVER_URL = `${GlobalConfig.server_url}:${GlobalConfig.server_port}`;

const graphService = {
  getData: async (): Promise<IInfluxDBData> => {
    const response = await axios.get(SERVER_URL + "/api/graph", {});

    return response.data;
  },
};

export default graphService;
