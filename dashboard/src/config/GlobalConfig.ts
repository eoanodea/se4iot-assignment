/**
 * Config types
 */
type IGlobalConfig = {
  [key: string]: any;
  env: string;
  server_url: string;
  server_port: string;
};

/**
 * Load in environment variables from the .env and export them
 * Has the single responsibility of configuring origins, to keep the service classes DRY
 */
const GlobalConfig: IGlobalConfig = {
  env: process.env.NODE_ENV || "development",
  server_url: process.env.REACT_APP_SERVER_URL || "http://localhost",
  server_port: process.env.REACT_APP_NODEJS_PORT || "",
};

export default GlobalConfig;
