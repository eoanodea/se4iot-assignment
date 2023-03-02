import GlobalConfig from "../config/GlobalConfig";

const Home = () => {
  return <h1>hey{GlobalConfig.server_port}</h1>;
};

export default Home;
