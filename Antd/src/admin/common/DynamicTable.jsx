import React, { useState, useMemo, useEffect, useContext } from "react";
import {
  Card,
  Table,
  Space,
  Button,
  Input,
  Dropdown,
  Modal,
  Pagination,
  Select,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined, MoreOutlined, RestOutlined } from "@ant-design/icons";
import useDynamicColumns from "./useDynamicClumns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "../css/AdminPage.css";
import "../css/TableCSS.css";
import TicketTable from "../../adminPages/adminTicket/TicketTable.jsx";
import PenalityTable from "../../adminPages/voilationReport/PenalityTable.jsx";
import LeaveLicense from "../../adminPages/adminPrograms/LeaveLicense.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { io } from "socket.io-client";
import { socket } from "./socket.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useTracking } from "../../context/TrackingContext.jsx";

// ....... end of import ........

export default function DynamicTable({
  title,
  resourceName,
  columnsDef,
  service,
  FormComponent,
  TPFormComponent,
  formFields,
  transformRecord,
  renderExpanded,
  hideCreate = false,
  hideEdit = false,
  hideAddTP = false,
  tracking = true,
  deleteLabel = "Delete",
  onRestore,
  onRestoreMany,

  ticketProgramId,
  penalityReportId,
  onTicketExpandChange,
  onReportExpandChange,
  canCreate,
  canEdit,
  canDelete,
  canView,
  canRestore,
  notificationReportId,
  // startTracking,
  // stopTracking,
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([]);
  // columnsDef.map((c) => c.key || c.dataIndex)  );

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddOpenTP, setIsAddOpenTP] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [ViewTickets, setViewTickets] = useState(null);

  const { userData } = useContext(AppContext);

  const { startTracking, stopTracking } = useTracking();

  console.log("DynamicTable startTracking:", startTracking);
  console.log("DynamicTable tracking:", tracking);

  // useEffect(() => {
  //   if (notificationReportId) {
  //     setExpandedRowKeys([notificationReportId]);
  //   }
  // }, [notificationReportId]);

  // const socket = io(import.meta.env.VITE_BACKEND_URL, {
  //   withCredentials: true,
  // });

  useEffect(() => {
    if (!resourceName) return;

    const createdEvent = `${resourceName}Created`;
    const updatedEvent = `${resourceName}Updated`;
    const deletedEvent = `${resourceName}Deleted`;

    const handleChange = () => {
      queryClient.invalidateQueries([resourceName]);
    };

    socket.on(createdEvent, handleChange);
    socket.on(updatedEvent, handleChange);
    socket.on(deletedEvent, handleChange);

    return () => {
      socket.off(createdEvent, handleChange);
      socket.off(updatedEvent, handleChange);
      socket.off(deletedEvent, handleChange);
    };
  }, [resourceName, queryClient]);

  const { data = [], isLoading } = useQuery({
    queryKey: [resourceName, { search }],
    queryFn: async () => {
      try {
        // console.log("DynamicTable fetch URL:", service);
        const res = await service?.list({ search });
        const arr = Array.isArray(res.data) ? res.data : [];
        return arr.map((r, i) => ({
          key: r._id || r.id || i,
          raw: r,
          ...((transformRecord && transformRecord(r, i)) || r),
        }));
      } catch (error) {
        console.log("Error fetching data:", error);
        toast.error(
          error.response?.data?.message ||
            "Error fetching data. Data might not Available.",
        );
        // toast.error(String(error) || "unable to list the records");
        return [];
      }
    },
  });
  useEffect(() => {
    setVisibleColumns(columnsDef.map((c) => c.key || c.dataIndex));
  }, [columnsDef]);

  useEffect(() => {
    if (!notificationReportId || !data?.length) return;

    const match = data.find((item) => item.raw._id === notificationReportId);

    if (match) {
      setExpandedRowKeys([match.key]);
    }
  }, [notificationReportId, data]);

  const roles = userData?.roles || [];
  // const filtered = useMemo(
  //   () =>
  //     data.filter((d) =>
  //       JSON.stringify(d).toLowerCase().includes(search.toLowerCase()),
  //     ),
  //   [data, search],
  // );

  const filtered = data; // Server-side search is implemented, so no need for client-side filtering
  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  const columns = useDynamicColumns(data, columnsDef).filter((c) =>
    visibleColumns.includes(c.key || c.dataIndex),
  );
  const handleDelete = async (id) => {
    try {
      if (onRestore) await onRestore(id);
      else await service.remove(id);
      toast.success(`${deleteLabel} successful`);
      queryClient.invalidateQueries([resourceName]);
    } catch (e) {
      toast.error(String(e) || `${deleteLabel} failed`);
    }
  };

  const handleDeleteMany = async () => {
    try {
      if (onRestoreMany) await onRestoreMany(selectedRowKeys);
      else if (service.removeMany) await service.removeMany(selectedRowKeys);
      else await Promise.all(selectedRowKeys.map((id) => service.remove(id)));

      // toast.success(`${selectedRowKeys.length} record(s) ${deleteLabel}d`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries([resourceName]);
    } catch (err) {
      toast.error("Error: " + err);
    }
  };

  const actionsColumn = {
    title: "Actions",
    key: "actions",
    fixed: "right",
    width: 64,
    align: "center",

    render: (_, record) => {
      const isRecycleBin = typeof onRestore === "function";
      // Recycle Bin → Restore button only
      if (isRecycleBin) {
        return (
          <Tooltip title="Restore">
            <Button
              type="link"
              size="small"
              style={{
                padding: 0,
                minWidth: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                Modal.confirm({
                  title: "Confirm Restore?",
                  content: "This record will be restored.",
                  onOk: async () => {
                    handleDelete(record.raw._id || record.key);
                  },
                });
              }}
              icon={<RestOutlined />}
            ></Button>
          </Tooltip>
        );
      }

      return (
        <Space size="small">
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "Edit",
                  disabled: !canEdit,
                  title: !canEdit ? "You don't have permission to edit" : "",
                },
                {
                  key: "delete",
                  label: "Delete",
                  disabled: !canDelete,
                  title: !canDelete
                    ? "You don't have permission to delete"
                    : "",
                },
                {
                  key: "view",
                  label: "View",
                  disabled: !canView,
                  title: !canView ? "You don't have permission to view" : "",
                },
              ],
              onClick: ({ key }) => {
                if (key === "edit") {
                  setEditing(record);
                  setExpandedRowKeys([record.key]);
                } else if (key === "delete") {
                  Modal.confirm({
                    // title: "Confirm delete",
                    // onOk: () => onDelete(record.raw._id || record.key),
                    title: `Confirm ${deleteLabel}?`,
                    onOk: () => handleDelete(record.raw._id || record.key),
                  });
                } else if (key === "view") {
                  setExpandedRowKeys((prev) =>
                    prev.includes(record.key)
                      ? prev.filter((k) => k !== record.key)
                      : [record.key],
                  );
                }
              },
            }}
          >
            <Button
              icon={<MoreOutlined />}
              size="small"
              style={{
                padding: 0,
                minWidth: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Dropdown>
        </Space>
      );
    },
  };

  const visibleColumnsDef = [...columns, actionsColumn];

  return (
    <Card
      title={title}
      extra={
        <Space>
          {/* .........Adding Button ......... */}
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="small"
            onClick={() => setIsAddOpenTP(true)}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              gap: "8px",
              height: "26px",
            }}
            hidden={hideCreate || !hideAddTP}
          >
            Add for TP
          </Button>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="small"
            onClick={() => setIsAddOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              gap: "8px",
              height: "26px",
            }}
            hidden={hideCreate || !canCreate}
          >
            Add
          </Button>
          {/* .........Adding Button ......... */}

          {/* .........Deleting Button ......... */}
          <Button
            type="primary"
            danger
            size="small"
            title={!canDelete ? "You don't have permission to delete" : ""}
            disabled={selectedRowKeys.length === 0 || !canDelete}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              gap: "8px",
              height: "26px",
            }}
            onClick={() => {
              Modal.confirm({
                title: `Confirm ${selectedRowKeys.length} ${deleteLabel}(s)?`,
                onOk: handleDeleteMany,
              });
            }}
          >
            {deleteLabel} {selectedRowKeys.length} Rows
          </Button>
          {/* .........Deleting Button ......... */}

          <Input.Search
            placeholder="Search"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Dropdown
            trigger={["click"]}
            popupRender={() => (
              <div style={{ padding: 12 }}>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>Columns</div>
                {columnsDef.map((c) => (
                  <div
                    key={c.key || c.dataIndex}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(c.key || c.dataIndex)}
                      onChange={() =>
                        setVisibleColumns((prev) =>
                          prev.includes(c.key || c.dataIndex)
                            ? prev.filter((x) => x !== (c.key || c.dataIndex))
                            : [...prev, c.key || c.dataIndex],
                        )
                      }
                    />
                    <div>{c.title}</div>
                  </div>
                ))}
              </div>
            )}
          >
            <Button size="small">Columns</Button>
          </Dropdown>
        </Space>
      }
    >
      <Table
        bordered
        size="small"
        className="compactTable stripedTable coloredHeader"
        rowClassName={(_, index) =>
          index % 2 === 0 ? "rowColerOne" : "rowColerTwo"
        }
        dataSource={paginated}
        columns={visibleColumnsDef}
        pagination={false}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowKeys: ticketProgramId
            ? [ticketProgramId]
            : penalityReportId
              ? [penalityReportId]
              : notificationReportId
                ? [notificationReportId]
                : expandedRowKeys,

          onExpandedRowsChange: (keys) => {
            setExpandedRowKeys(keys);

            // Notify parent
            if (onTicketExpandChange) {
              onTicketExpandChange(keys);
            }
            // Notify parent for penality table
            if (onReportExpandChange) {
              onReportExpandChange(keys);
            }
          },

          expandedRowRender: (record) => {
            if (
              !hideEdit &&
              FormComponent &&
              editing &&
              editing.key === record.key
            ) {
              return (
                <div style={{ padding: "16px" }}>
                  <FormComponent
                    initialValues={{
                      ...editing.raw,
                      date: editing.raw.date ? dayjs(editing.raw.date) : null,
                    }}
                    onFinish={async (vals) => {
                      try {
                        await service.update(
                          record.raw._id || record.key,
                          vals,
                        );
                        toast.success("Updated Successfully");
                        setEditing(null);
                        queryClient.invalidateQueries([resourceName]);
                      } catch (error) {
                        toast.error(String(error) || "Something went wrong");
                      }
                    }}
                    onCancel={() => {
                      setEditing(null);
                      setExpandedRowKeys([]);
                    }}
                  />
                </div>
              );
            }
            // TICKETS MODE (NEW)
            else if (ticketProgramId === record.key) {
              return (
                <div style={{ padding: 12 }}>
                  <TicketTable programId={record.raw._id} />
                </div>
              );
            }
            // Penality MODE (NEW)
            else if (penalityReportId === record.key) {
              return (
                <div style={{ padding: 12 }}>
                  <PenalityTable reportId={record.raw._id} />
                </div>
              );
            } else {
              // If custom renderer exists → use it
              if (typeof renderExpanded === "function") {
                return renderExpanded(record.raw, record);
              } else {
                // Otherwise fallback to JSON view
                return (
                  <div style={{ padding: 12 }}>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(record.raw, null, 2)}
                    </pre>
                  </div>
                );
              }
            }
          },
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          fixed: true,
        }}
        rowKey="key"
        scroll={{ x: "max-content" }}
        loading={isLoading}
      />
      {/* ..... end of table..... */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <div>
          Showing {paginated.length} of {filtered.length}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filtered.length}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            size="small"
          />
          <Select
            value={pageSize}
            onChange={(v) => {
              setPageSize(v);
              setPage(1);
            }}
            style={{ width: 120 }}
            size="small"
          >
            {[5, 10, 20, 50, 100, 150, 200].map((n) => (
              <Select.Option key={n} value={n}>
                {n} / page
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Add modal */}
      {!hideCreate && FormComponent && (
        <>
          <Modal
            open={isAddOpen}
            onCancel={() => setIsAddOpen(false)}
            footer={null}
            width="90%"
            style={{ maxWidth: 700 }}
          >
            <FormComponent
              onFinish={async (vals) => {
                try {
                  // if (tracking) {
                  //   console.log("BEFORE CREATE");

                  //   const report = await service.create(vals);

                  //   console.log("CREATED REPORT:", report.data);
                  //   console.log("CALLING START TRACKING");

                  //   startTracking(report.data._id);
                  // }
                  if (tracking) {
                    console.log("STEP 1: tracking entered");
                    try {
                      const report = await service.create(vals);
                      console.log("STEP 2: report created");
                      console.log(report);
                      console.log("STEP 3: report id");

                      console.log(report?.data?._id);
                      console.log("STEP 4: calling startTracking");
                      startTracking(report.data._id);

                      console.log("STEP 5: startTracking returned");
                    } catch (error) {
                      console.log("CREATE ERROR:", error);
                    }
                  } else {
                    await service.create(vals);
                  }

                  // message.success("Created");
                  toast.success("Data Created");
                  setIsAddOpen(false);
                  queryClient.invalidateQueries([resourceName]);
                } catch (error) {
                  console.error("Error creating data:", error);
                  toast.error(
                    error.response?.data?.message || "Error creating data!",
                  );
                }
              }}
              onCancel={() => setIsAddOpen(false)}
            />
          </Modal>
        </>
      )}

      {/* Add modal */}
      {hideAddTP && TPFormComponent && (
        <>
          <Modal
            open={isAddOpenTP}
            onCancel={() => setIsAddOpenTP(false)}
            footer={null}
            width="90%"
            style={{ maxWidth: 700 }}
          >
            <TPFormComponent
              onFinish={async (vals) => {
                try {
                  await service.create(vals);
                  // message.success("Created");
                  toast.success("Data Created");
                  setIsAddOpenTP(false);
                  queryClient.invalidateQueries([resourceName]);
                } catch (error) {
                  console.error("Error creating data:", error);
                  toast.error(
                    error.response?.data?.message || "Error creating data!",
                  );
                }
              }}
              onCancel={() => setIsAddOpenTP(false)}
            />
          </Modal>
        </>
      )}
    </Card>
  );
}
