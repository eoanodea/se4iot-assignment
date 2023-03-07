import { Grid, Typography } from "@mui/material";
import { IBulb } from "../interfaces";
import Bulb from "./Bulb";

interface IListBulbs {
  bulbs: IBulb[];
  updateState: (id: string, state: "ON" | "OFF") => void;
}

const ListBulbs = ({ bulbs, updateState }: IListBulbs) => {
  return (
    <>
      <Typography variant="h2">Available Bulbs</Typography>
      <Grid container spacing={6}>
        {bulbs.map((bulb, index) => (
          <Bulb bulb={bulb} key={index} updateState={updateState} />
        ))}
      </Grid>
    </>
  );
};

export default ListBulbs;
