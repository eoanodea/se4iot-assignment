import { Grid, Typography } from "@mui/material";
import { IBulb } from "../interfaces";
import Bulb from "./Bulb";

interface IListBulbs {
  bulbs: IBulb[];
}

const ListBulbs = ({ bulbs }: IListBulbs) => {
  return (
    <>
      <Typography variant="h2">Available Bulbs</Typography>
      <Grid container spacing={6}>
        {bulbs.map((bulb, index) => (
          <Bulb bulb={bulb} key={index} />
        ))}
      </Grid>
    </>
  );
};

export default ListBulbs;
