import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./css/index.css";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <AppContextProvider>
      <App />
    </AppContextProvider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);
