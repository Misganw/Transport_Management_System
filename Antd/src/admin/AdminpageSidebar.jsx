import React, { useState, useEffect, useContext } from "react";
import { Layout, Menu, Menu as AntMenu, Typography, Select } from "antd";
import {
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BellOutlined,
  CarOutlined,
  GroupOutlined,
  HeatMapOutlined,
  EnvironmentOutlined,
  UserSwitchOutlined,
  UserDeleteOutlined,
  UsergroupAddOutlined,
  ScheduleOutlined,
  IeOutlined,
  EyeOutlined,
  CreditCardFilled,
  IdcardFilled,
  IdcardOutlined,
  DeleteColumnOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./css/AdminPage.css";
import { AppContext } from "../context/AppContext";

const { Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
function AdminpageSidebar(props) {
  const { userData } = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(false);
  // console.log(userData.roles);
  const role = userData.roles;
  return (
    <>
      <Sider
        className={props.SidebarShow ? "admin-sider" : "collapsedSidebar"}
        width={200}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["users"]}
          selectedKeys={[props.selectedMenu]}
          onClick={(e) => props.onMenuSelect(e.key)}
          style={{ height: "100%", overflowY: "auto" }}
          items={[
            {
              key: "address",
              icon: <EnvironmentOutlined />,
              label: "Addresses",
              // disabled: role === "manager",
              children: [
                { key: "countryState", label: "Country & State" },
                { key: "zone", label: "Zone" },
                { key: "wereda", label: "Wereda" },
                { key: "city", label: "City" },
              ],
            },
            {
              key: "employees",
              icon: <UserSwitchOutlined />,
              label: "Employees",
            },
            { key: "users", icon: <UsergroupAddOutlined />, label: "Users" },
            { key: "owners", icon: <GroupOutlined />, label: "Owners" },
            { key: "routs", icon: <HeatMapOutlined />, label: "Routs" },
            { key: "subrouts", icon: <HeatMapOutlined />, label: "Sub Routs" },
            { key: "cars", icon: <CarOutlined />, label: "Cars" },
            { key: "programs", icon: <ScheduleOutlined />, label: "Programs" },
            { key: "tickets", icon: <IdcardOutlined />, label: "Ticketes" },
            {
              key: "canceledTickets",
              icon: <IdcardOutlined />,
              label: "Canceled Tickets",
            },
            {
              key: "rules",
              icon: <DeleteColumnOutlined />,
              label: "Rules",
            },
            { key: "police", icon: <EyeOutlined />, label: "Traffic Polices" },
            {
              key: "asignTpolices",
              icon: <CarOutlined />,
              label: "Asign T Polices",
            },
            {
              key: "voilationReport",
              icon: <CloseOutlined />,
              label: "Voilation Report",
            },

            {
              key: "analytics",
              icon: <BarChartOutlined />,
              label: "Analytics",
            },
            { key: "reports", icon: <FileTextOutlined />, label: "Reports" },
            { key: "settings", icon: <SettingOutlined />, label: "Settings" },
            {
              key: "recycleBin",
              icon: <UserDeleteOutlined />,
              label: "Recycle Bin",
            },
            {
              key: "notification",
              icon: <BellOutlined />,
              label: "Notifications",
            },
            // ...Array.from({ length: 3 }).map((_, i) => ({
            //   key: `m${i + 6}`,
            //   icon: <MenuUnfoldOutlined />,
            //   label: `Menu ${i + 6}`,
            // })),
          ]}
        />
      </Sider>
    </>
  );
}

export default AdminpageSidebar;
