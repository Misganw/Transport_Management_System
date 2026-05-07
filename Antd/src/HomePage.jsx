import React, { useState, useContext, useEffect } from "react";
import { Space } from "antd";
import "./css/admin/Admin.css";
import Carousel from "react-bootstrap/Carousel";

// ...End of all Imports

function HomePage() {
  const [login, setLogin] = useState(false);
  const loginPage = () => {
    setLogin(!login);
  };
  return (
    <>
      <div className="adminContainer">
        <AdminHeader />
        <Space className="spaceSize">
          {/* {!login ? <IndexPage /> : <AdminBody />} */}
          {/* <div className="CarouselDiv"> */}
        </Space>

        <AdminFooter />
      </div>
    </>
  );
}

export default HomePage;
