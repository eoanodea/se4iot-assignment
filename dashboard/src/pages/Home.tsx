import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import EmptyState from "../components/EmptyState";
import Graph from "../components/Graph";
import ListBulbs from "../components/ListBulbs";
import Loading from "../components/Loading";
import { DataPoint, IBulb } from "../interfaces";
import bulbService from "../services/bulbService";
import graphService from "../services/graphService";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bulbs, setBulbs] = useState<IBulb[]>([]);
  const [graphData, setGraphData] = useState<DataPoint[]>([]);

  useEffect(() => {
    graphService
      .getData()
      .then((data) => {
        setGraphData(data.data);
      })
      .catch((err) => {
        console.log("Could not fetch graph data");
      });
    bulbService
      .getAll()
      .then((data) => {
        if (data) {
          setBulbs(data);
          setLoading(false);
        } else {
          setError("Error: Could not fetch data");
          setLoading(false);
        }
      })
      .catch((err) => {
        setError("Error: Could not fetch data");
        setLoading(false);
      });
  }, []);

  const updateState = (id: string, state: "ON" | "OFF") => {
    bulbService
      .updateBulb(id, state)
      .then((data) => {
        if (data) {
          const newBulbs = bulbs;

          const bulbIndex = newBulbs.findIndex(
            (item) => item.ip === data[0].ip
          );
          newBulbs[bulbIndex] = data[0];
          setBulbs([...newBulbs]);
        } else {
          console.log("server issue");
        }
      })
      .catch((err) => {
        console.log("another issue", err);
      });
  };

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  return (
    <>
      <Grid item md={6}>
        {graphData.length > 0 && <Graph influxData={graphData} />}
      </Grid>
      <Grid item md={6}>
        <ListBulbs bulbs={bulbs} updateState={updateState} />
      </Grid>
    </>
  );
};

export default Home;
