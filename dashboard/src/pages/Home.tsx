import { useEffect } from "react";
import ListBulbs from "../components/ListBulbs";
import GlobalConfig from "../config/GlobalConfig";

const Home = () => {
  return (
    <>
      <h1>hey{GlobalConfig.server_port}</h1>

      <ListBulbs />
    </>
  );
};

export default Home;
