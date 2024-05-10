import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import "./containers/home/index.css";
import App from "./App";
import theme from "./Component/style/theme";

//Theme er importert her slik at det kan være universelt tilgjengelig i alle filene
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
