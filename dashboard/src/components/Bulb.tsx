import styled from "@emotion/styled";
import {
  Card,
  CardActions,
  CardHeader,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { IBulb } from "../interfaces";

interface IBulbProps {
  bulb: IBulb;
}

const StyledCard = styled(Card)`
  text-align: center;
  & .MuiCardHeader-title {
    font-size: 45px;
  }
`;

const StyledCardActions = styled(CardActions)`
  justify-content: end;
`;

const Bulb = ({ bulb }: IBulbProps) => {
  const [isOn, setIsOn] = useState(bulb.state === "ON");

  return (
    <Grid item xs={12} md={4}>
      <StyledCard>
        <CardHeader title="💡" subheader={bulb.ip} />
        <StyledCardActions>
          <FormGroup>
            <FormControlLabel
              control={<Switch value={isOn} />}
              label={isOn ? "ON" : "OFF"}
            />
          </FormGroup>
        </StyledCardActions>
      </StyledCard>
    </Grid>
  );
};

export default Bulb;
