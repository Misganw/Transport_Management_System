import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Tooltip,
  Table,
  Tag,
  Pagination,
  Select,
  Input,
  Menu as AntMenu,
  Grid,
} from "antd";
import {
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BellOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import "./css/AdminPage.css";
import AdminpageFooter from "./AdminpageFooter";
import AdminpageHeader from "./AdminpageHeader";
import AdminpageSidebar from "./AdminpageSidebar";
// import Analytics from "./Analytics";
import Settings from "./Settings";
import Reports from "./Reports";
import Notifications from "./Notifications";
import AdminNewsUpload from "./AdminNewsUpload";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import UsersTable from "./UsersTable";
import CarTables from "../adminPages/adminCars/CarTables";
import DriversTable from "../adminPages/adminDrivers/DriverTable.jsx";
import EmployeeTable from "../adminPages/adminEmployee/EmployeeTable.jsx";
import CountryStateTable from "../adminPages/adminAddresses/CountyStateTable.jsx";
import ZoneTable from "../adminPages/adminAddresses/ZoneTable.jsx";
import WeredaTable from "../adminPages/adminAddresses/WeredaTable.jsx";
import CityTable from "../adminPages/adminAddresses/CityTable.jsx";
import RecycleBin from "./RecycleBin.jsx";
import RoutTable from "../adminPages/routs/routTable.jsx";
import ProgramTable from "../adminPages/adminPrograms/ProgramTable.jsx";
import OwnerTable from "../adminPages/adminOwners/OwnerTable.jsx";
import Ticket from "../adminPages/adminTicket/Ticket.jsx";
import CanceledTicketTable from "../adminPages/adminTicket/CanceledTicketTable.jsx";
import RuleTable from "../adminPages/adminRules/RuleTable.jsx";
import TrafficPoliceTable from "../adminPages/adminTrafficPolice/TrafficPoliceTable.jsx";
import AssignPoliceTable from "../adminPages/adminTrafficPolice/AssignPoliceTable.jsx";
import SubroutTable from "../adminPages/routs/subRoutTable.jsx";
import VoilationTable from "../adminPages/voilationReport/VoilationTable.jsx";

import Analytics from "./analytics/Analytics.jsx";

import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

function AdminPage() {
  const location = useLocation();
  const navState = location.state || {};

  const { backendURL, setIsloggedIn, getUserData } = useContext(AppContext);
  const { userData } = useContext(AppContext);
  const [showSidebar, setShowSidebar] = useState(true);
  const show_Sidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Auto-hide sidebar if screen width <= 440px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 440) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (navState?.selectedMenu) {
      setSelectedMenu(navState.selectedMenu);
    }
  }, [navState]);

  const screens = useBreakpoint();
  const isSmall = !screens.xs && window.innerWidth <= 360; // extra safety

  // State
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(navState.selectedMenu || "");
  // Render content dynamically based on selected menu
  const queryClient = new QueryClient();
  const renderContent = () => {
    const roles = userData?.roles || [];

    // If passenger, restrict access
    if (roles.includes("passenger")) {
      if (
        ![
          "canceledTickets",
          "tickets",
          "programs",
          "rules",
          "voilationReport",
          "countryState",
          "zone",
          "wereda",
          "city",
          "cars",
        ].includes(selectedMenu)
      ) {
        return <div>Access Denied!. Passenger role has limited access.</div>;
      }
    }
    // If officer, restrict access
    if (roles.includes("officer")) {
      if (
        ![
          "routs",
          "subrouts",
          "reports",
          "programs",
          "rules",
          "voilationReport",
          "police",
          "asignTpolices",
          "tickets",
          "drivers",
          "countryState",
          "zone",
          "wereda",
          "city",
          "cars",
        ].includes(selectedMenu)
      ) {
        return (
          <div>Access Denied!. Traffic Police role has limited access.</div>
        );
      }
    }

    // If officer, restrict access
    if (roles.includes("officer")) {
      if (
        ![
          "routs",
          "subrouts",
          "reports",
          "programs",
          "rules",
          "voilationReport",
          "police",
          "asignTpolices",
          "tickets",
          "drivers",
          "countryState",
          "zone",
          "wereda",
          "city",
          "cars",
        ].includes(selectedMenu)
      ) {
        return <div>Access Denied!. Coordinator role has limited access.</div>;
      }
    }

    switch (selectedMenu) {
      case "countryState":
        return <CountryStateTable />;
      case "zone":
        return <ZoneTable />;
      case "wereda":
        return <WeredaTable />;
      case "city":
        return <CityTable />;
      case "employees":
        return <EmployeeTable />;
      case "owners":
        return <OwnerTable />;
      case "drivers":
        return <DriversTable />;
      case "users":
        return <UsersTable />;
      case "routs":
        return <RoutTable />;
      case "subrouts":
        return <SubroutTable />;
      case "cars":
        return <CarTables />;
      case "programs":
        return <ProgramTable />;
      case "tickets":
        return <Ticket />;
      case "canceledTickets":
        return <CanceledTicketTable />;
      case "rules":
        return <RuleTable />;
      case "police":
        return <TrafficPoliceTable />;
      case "asignTpolices":
        return <AssignPoliceTable />;
      case "voilationReport":
        return <VoilationTable notificationReportId={navState?.reportId} />;
      case "analytics":
        return <Analytics />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      case "recycleBin":
        return <RecycleBin />;
      case "notification":
        return <Notifications />;

      case "homecontent":
        return <AdminNewsUpload />;
      default:
        return <Analytics />;
    }
  };

  return (
    <Layout className="admin-layout">
      {/* Header */}
      <AdminpageHeader SidebarShow={show_Sidebar} switchIcon={showSidebar} />

      <Layout>
        {/* Sidebar */}
        <AdminpageSidebar
          SidebarShow={showSidebar}
          selectedMenu={selectedMenu}
          onMenuSelect={setSelectedMenu}
        />

        {/* Content */}
        <Layout>
          <Content
            className={`admin-content ${showSidebar ? "" : "sidebar-hidden"}`}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {/* <UsersTable /> */}
                {renderContent()}
              </Col>
            </Row>
          </Content>

          {/* Footer */}
          <AdminpageFooter SidebarShow={showSidebar} />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default AdminPage;
