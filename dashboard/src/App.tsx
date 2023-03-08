import React from "react";
import {
  AppBar,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import theme from "./theme";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography>Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        component="main"
        style={{ marginTop: "40px", marginBottom: "40px", minHeight: "60vh" }}
        justifyContent="space-evenly"
        spacing={6}
      >
        {/* <Grid item xs={11}> */}
        <Home />
        {/* </Grid> */}
      </Grid>
    </ThemeProvider>
  );
}

export default App;
