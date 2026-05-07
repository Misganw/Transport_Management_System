import React, { useState, useContext, useEffect } from "react";
import { Space } from "antd";
// import AdminBody from "./adminBody/AdminBody.jsx";
// import AdminHeader from "./adminHeader/AdminHeader.jsx";
// import AdminFooter from "./adminFooter/AdminFooter.jsx";
// import AdminSideBar from "./adminSidebar/AdminSideBar.jsx";
import AdminPage from "./AdminPage.jsx";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

// ...End of all Imports

function Admin() {
  const [prof, setProf] = useState(false);
  const { userData, getUserData } = useContext(AppContext);
  const profileDetail = () => {
    setProf(!prof);
  };

  return (
    <>
      <AdminPage />
    </>
  );
}

export default Admin;
