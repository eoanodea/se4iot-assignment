import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontWeight: 500,
      fontSize: "3rem",
      marginBottom: "20px",
    },
    h2: {
      fontWeight: 400,
      fontSize: "1.6rem",
      marginBottom: "20px",
    },
    // background: {
    //   default: "#225D61",
    // },
    // primary: {
    //   main: "#287f85",
    // },
    // secondary: {
    //   main: "#ff9b35",
    // },
  },
});

export default theme;
