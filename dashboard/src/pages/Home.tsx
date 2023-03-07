import { useState, useEffect } from "react";
import EmptyState from "../components/EmptyState";
import ListBulbs from "../components/ListBulbs";
import Loading from "../components/Loading";
import { IBulb } from "../interfaces";
import bulbService from "../services/bulbService";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bulbs, setBulbs] = useState<IBulb[]>([]);

  useEffect(() => {
    bulbService.getAll().then((data) => {
      if (data) {
        setBulbs(data);
        setLoading(false);
      } else {
        setError("Error: Could not fetch data");
      }
    });
  }, []);

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  return (
    <>
      <ListBulbs bulbs={bulbs} />
    </>
  );
};

export default Home;
