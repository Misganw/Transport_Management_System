import React, { useState } from "react";
import { Card, Tabs, Divider } from "antd";

import AnalyticsToolbar from "./pages/AnalyticsToolbar";
// Dashboards
import OverviewDashboard from "./pages/OverviewDashboard";
import FleetDashboard from "./pages/FleetDB";
import TicketDashboard from "./pages/TicketDB";
import FinanceDashboard from "./pages/FinancialDB";
import ViolationDashboard from "./pages/VoilationDB";
import UserDashboard from "./pages/UserDB";
import GeographicDashboard from "./pages/GeographicDB";
import LiveDashboard from "./pages/LiveDB";

const Analytics = () => {
  // -----------------------------
  // Global Filters
  // -----------------------------
  const [filters, setFilters] = useState({
    dateRange: null,
    company: "all",
    route: "all",
    driver: "all",
  });

  // -----------------------------
  // Selected Tab
  // -----------------------------
  const [activeTab, setActiveTab] = useState("overview");

  // -----------------------------
  // Refresh Dashboard
  // -----------------------------
  const handleRefresh = () => {
    console.log("Refreshing dashboard...");
    // React Query refetch will be added later
  };

  // -----------------------------
  // Export Dashboard
  // -----------------------------
  const handleExport = (type) => {
    console.log("Export:", type);
  };

  // -----------------------------
  // Dashboard Tabs
  // -----------------------------
  const items = [
    {
      key: "overview",
      label: "Overview",
      children: <OverviewDashboard filters={filters} />,
    },
    {
      key: "fleet",
      label: "Fleet",
      children: <FleetDashboard filters={filters} />,
    },
    {
      key: "tickets",
      label: "Tickets",
      children: <TicketDashboard filters={filters} />,
    },
    {
      key: "violations",
      label: "Violations",
      children: <ViolationDashboard filters={filters} />,
    },
    {
      key: "finance",
      label: "Finance",
      children: <FinanceDashboard filters={filters} />,
    },
    {
      key: "users",
      label: "Users",
      children: <UserDashboard filters={filters} />,
    },
    {
      key: "geographic",
      label: "Geographic",
      children: <GeographicDashboard filters={filters} />,
    },
    {
      key: "live",
      label: "Live Monitoring",
      children: <LiveDashboard filters={filters} />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* =======================================
            Toolbar
         ======================================= */}
      <Card
        style={{
          marginBottom: 18,
          borderRadius: 10,
        }}
      >
        <AnalyticsToolbar
          filters={filters}
          setFilters={setFilters}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      </Card>

      {/* =======================================
            Dashboard Tabs
         ======================================= */}

      <Card
        variant="none"
        style={{
          borderRadius: 10,
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          items={items}
        />
      </Card>

      <Divider />
    </div>
  );
};

export default Analytics;
