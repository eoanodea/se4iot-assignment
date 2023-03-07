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
import { useEffect, useState } from "react";
import { IBulb } from "../interfaces";

interface IBulbProps {
  bulb: IBulb;
  updateState: (id: string, state: "ON" | "OFF") => void;
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

const Bulb = ({ bulb, updateState }: IBulbProps) => {
  const [isOn, setIsOn] = useState(bulb.state === "ON");
  const [loading, setLoading] = useState(false);

  const handleSwitch = (e: any) => {
    setLoading(true);
    updateState(bulb.id.toString(), e.target.checked ? "ON" : "OFF");
  };

  useEffect(() => {
    setIsOn(bulb.state === "ON");
    setLoading(false);
  }, [bulb]);

  return (
    <Grid item xs={12} md={4}>
      <StyledCard>
        <CardHeader title="💡" subheader={bulb.ip} />
        <StyledCardActions>
          <FormGroup>
            <FormControlLabel
              control={<Switch value={isOn} onChange={handleSwitch} />}
              label={isOn ? "ON" : "OFF"}
              disabled={loading}
            />
          </FormGroup>
        </StyledCardActions>
      </StyledCard>
    </Grid>
  );
};

export default Bulb;
