import { useEffect, useState } from "react";
import bulbService from "../services/bulbService";

const ListBulbs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bulbs, setBulbs] = useState([]);

  useEffect(() => {
    bulbService.getAll().then((res) => {
      if (res && res.data) {
        setBulbs(res.data);
        setLoading(false);
      } else {
        setError("Error: Could not fetch data");
      }
    });
  }, []);

  if (loading) return <h2>loading</h2>;
  return <>{bulbs.length}</>;
};

export default ListBulbs;
