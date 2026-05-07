import React from "react";
import { useState, useContext } from "react";
import profile from "../assets/images/cat.jpg";
import { AppContext } from "../context/AppContext";
import {
  Layout,
  Typography,
  Dropdown,
  Menu as AntMenu,
  Menu,
  Select,
  Avatar,
  Button,
} from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import Logo from "../assets/etlogo.jpg";
import "./css/AdminPage.css";
import ChangePasswordModal from "../verify/ChangePasswordModal";
const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

function AdminpageHeader(props) {
  const { logout, userData } = useContext(AppContext);
  const profileSrc = userData?.profileImage
    ? userData.profileImage
    : { profile };
  const [open, setOpenModal] = useState(false);

  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);
  return (
    <div>
      <Header className="admin-header">
        <div className="header-inner">
          <div className="left">
            {/* Toggle button */}
            <Button
              type="text"
              onClick={props.SidebarShow}
              icon={props.switchIcon ? <CloseOutlined /> : <MenuOutlined />}
              style={{ fontSize: "20px", marginRight: "12px" }}
            />
            <img src={Logo} alt="Company Logo" className="company-logo" />
            <Title level={4} className="brand">
              Admin Panel
            </Title>
          </div>
          <div className="middle">
            <Title level={4} className="brand">
              {userData
                ? `Logged User:- ${userData?.name} `
                : "Admin Dashboard"}
            </Title>
          </div>
          <div className="right">
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="profile-dropdown"
              popupRender={() => (
                <div className="profile-card">
                  <div className="profile-header">
                    <Avatar size={64} src={userData.profileImage} />
                    <div className="profile-info">
                      <Title level={5} style={{ margin: 0 }}>
                        {userData.name}
                      </Title>
                      <Text type="secondary">{userData.roles}</Text>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <Button block>Details</Button>
                    <Button block onClick={openModal}>
                      Change Password
                    </Button>
                    <Button block danger onClick={logout}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            >
              <Avatar
                size={40}
                src={userData?.profileImage}
                className="profile-trigger"
              />
            </Dropdown>
          </div>
        </div>
      </Header>
      <ChangePasswordModal
        open={open}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
}

export default AdminpageHeader;
