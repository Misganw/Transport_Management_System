import React, { useEffect, useState } from "react";
import { Space } from "antd";
import "./App.css";
// import IndexPage from "./IndexPage.jsx";
// import PracticeHome from "./practice/PracticeHome.jsx";
import { BrowserRouter, Router } from "react-router-dom";
import Admin from "./admin/Admin.jsx";
import AppRoutes from "./admin/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...........end importing files
const queryClient = new QueryClient();
function App() {
  //Create a state variable for user
  const [user, setUser] = useState(null);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <AppRoutes />
      </QueryClientProvider>
    </>
  );
}

export default App;
