// src/modules/employees/employeesTable.jsx
import React, { useState, useEffect, useContext } from "react";
import DynamicTable from "./common/DynamicTable";
// import { makeService } from "../../admin/common/services";
import UserForm from "./UserForm";
import TPUserForm from "./TPUserForm";
import { Avatar, Tag } from "antd";
import { usersService } from "./common/makeServices";
import "./css/Admin.css";
import "./css/AdminPage.css";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { AppContext } from "../context/AppContext";

// const service = makeService("employees");

const columns = [
  {
    title: "Employee Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
  },
  // {
  //   title: "Password",
  //   dataIndex: "password",
  //   key: "password",
  //   sorter: (a, b) => (a.password || "").localeCompare(b.password || ""),
  // },
  {
    title: "Role",
    dataIndex: "roles",
    key: "roles",
    sorter: (a, b) => (a.roles || "").localeCompare(b.roles || ""),
    filters: [
      { text: "Admin", value: "admin" },
      { text: "Manager", value: "manager" },
      { text: "Officer", value: "officer" },
      { text: "Coordinator", value: "coordinator" },
      { text: "Passenger", value: "passenger" },
    ],
    onFilter: (value, record) => record.roles === value,
    render: (role) => {
      const roleColors = {
        admin: "red",
        manager: "blue",
        officer: "green",
        coordinator: "purple",
        passenger: "gold",
      };

      return (
        <Tag bordered={false} color={roleColors[role] || "default"}>
          {role?.toLowerCase()}
        </Tag>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "statuses",
    key: "statuses",
    sorter: (a, b) => (a.statuses || "").localeCompare(b.statuses || ""),
    filters: [
      { text: "Active", value: "Active" },
      { text: "Inactive", value: "Inactive" },
    ],
    onFilter: (value, record) => record.statuses === value,
    render: (status) => {
      const statusConfig = {
        Active: {
          color: "green",
          icon: <CheckCircleOutlined />,
        },
        Inactive: {
          color: "red",
          icon: <CloseCircleOutlined />,
        },
      };

      const config = statusConfig[status];

      return (
        <Tag
          bordered={false}
          color={config?.color || "default"}
          icon={config?.icon}
        >
          {/* {status} */}
        </Tag>
      );
    },
  },
  {
    title: "Created Date",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    defaultSortOrder: "descend", // newest first
    render: (value) => new Date(value).toLocaleString(),
  },
];

export default function UsersTable() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  // ROLE Filteration for actions
  const rawRoles = useContext(AppContext)?.userData?.roles;
  const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];
  const hasRole = (...allowedRoles) => {
    return roles.some((r) => allowedRoles.includes(r));
  };
  const canCreate = hasRole("admin", "manager");
  const canEdit = hasRole("admin", "manager");
  const canDelete = hasRole("admin", "manager");
  const canView = hasRole("admin", "manager");
  const canRestore = hasRole("admin", "manager");
  // ROLE Filteration for actions

  return (
    <DynamicTable
      title="Users"
      resourceName="users"
      columnsDef={columns}
      service={usersService}
      FormComponent={UserForm}
      TPFormComponent={TPUserForm}
      hideAddTP
      canCreate={canCreate}
      canEdit={canEdit}
      canDelete={canDelete}
      canView={canView}
      canRestore={canRestore}
      transformRecord={(r) => ({
        ...r,
        fullName: `${r.fName || ""} | ${r.mName || ""} | ${
          r.lName || ""
        }`.trim(),
      })}
      renderExpanded={(raw) => (
        <div style={{ padding: 12, lineHeight: "1.8" }}>
          <div>
            <strong> Employee Name:</strong> {raw.name}
          </div>
          <div>
            <strong> Email:</strong> {raw.email}
          </div>
          <div>
            <strong>Role:</strong> {raw.roles}
          </div>
          <div>
            <strong>Status:</strong> {raw.statuses}
          </div>
          <div>
            <strong>Age:</strong> {raw.age}
          </div>
          <div>
            <strong>Gender:</strong> {raw.gender}
          </div>
          <div>
            <Avatar
              size={40}
              src={backendURL + raw?.profileImage}
              className="profile-trigger"
            />
          </div>
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(raw.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(raw.updatedAt).toLocaleString()}
          </div>
        </div>
      )}
    />
  );
}
