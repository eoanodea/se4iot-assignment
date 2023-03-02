import React from "react";
import { AppBar, ThemeProvider, Toolbar, Typography } from "@mui/material";
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
      <Home />
    </ThemeProvider>
  );
}

export default App;
