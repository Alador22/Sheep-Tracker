//Alador
//brukte Material Ui Theme funksjonen slik at jeg kan enkelt integrere og endre stilen jeg ønsket for de forskjellige sidene og elementene
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4e3570",
    },
    secondary: {
      main: "#2a3b44",
    },
    background: {
      default: "#fafafa",
      paper: "#f0f0f0",
    },
    text: {
      primary: "#212121",
      secondary: "#000",
    },
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.2rem",
      fontWeight: 500,
      color: "#212121",
    },
    h2: {
      fontSize: "1.8rem",
      fontWeight: 500,
      color: "#212121",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      color: "#757575",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#757575",
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#3c515b",
          "&:hover": {
            backgroundColor: "#cfd8dc",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#f0f0f0",
        },
      },
    },
  },
});

export default theme;
