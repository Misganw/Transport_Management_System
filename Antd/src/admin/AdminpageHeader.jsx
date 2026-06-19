import React from "react";
import { useState, useContext, useEffect } from "react";
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
  Popover,
  Badge,
  List,
  notification,
} from "antd";
import { MenuOutlined, CloseOutlined, BellOutlined } from "@ant-design/icons";
import Logo from "../assets/etlogo.jpg";
import "./css/AdminPage.css";
import ChangePasswordModal from "../verify/ChangePasswordModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [notifications, setNotifications] = useState([]);
  const [previousCount, setPreviousCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.roles !== "officer") return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [userData]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${backendURL}/notifications/unread`);
      const newNotifications = res.data;

      if (previousCount > 0 && newNotifications.length > previousCount) {
        const latest = newNotifications[0];

        notification.info({
          message: latest.title,
          description: latest.message,
          placement: "topRight",
          duration: 5,
        });
      }

      setPreviousCount(newNotifications.length);
      setNotifications(newNotifications);
    } catch (err) {
      console.log(err);
    }
  };

  const openNotification = async (notificationId, reportId) => {
    try {
      const res = await axios.put(
        `${backendURL}/notifications/open/${notificationId}`,
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      // Optional:
      navigate("/adminDashboard/*", {
        state: {
          // reportId: res.data.reportId,
          selectedMenu: "voilationReport",
          reportId: res.data.reportId,
        },
      });
      //  for production use the following line
      // navigate(`/voilations/${res.data.reportId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const notificationContent = (
    <div style={{ width: 320 }}>
      <List
        dataSource={notifications}
        locale={{ emptyText: "No new notifications" }}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: "pointer" }}
            // onClick={() => openNotification(item._id, item.reportId)}
            onClick={() => openNotification(item._id)}
          >
            <List.Item.Meta title={item.title} description={item.message} />
          </List.Item>
        )}
      />
    </div>
  );
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

          <div
            className="right"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {/* Notification Bell */}
            {userData?.roles === "officer" && (
              <Popover
                content={notificationContent}
                title="Notifications"
                trigger="click"
                placement="bottomRight"
              >
                <Badge count={notifications.length} size="small">
                  <BellOutlined
                    style={{
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </Popover>
            )}
            {/* Profile drop down */}

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
