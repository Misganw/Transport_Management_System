import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  ticketService,
  passengerServices,
  voilationService,
  penalityServices,
} from "../../admin/common/makeServices";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function PenalityModal({ report, onClose }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [voilationReport, setVoilationReport] = useState([]);

  // Build display label once
  const reportLabel = `${
    report.officerAssignmentId?.subrouteId?.subdeparture
  } → ${
    report.officerAssignmentId?.subrouteId?.subarrival
  } | ${report.ticketId?.programId?.carId?.type || " "} - ${
    report.ticketId?.programId?.carId?.level || " "
  }  |  ${dayjs(report.createdAt).format("YYYY-MM-DD")}`;

  // Auto-fill on open
  useEffect(() => {
    form.setFieldsValue({
      reporteId: report._id,
      reportDisplay: reportLabel,
    });
  }, [report]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await voilationService.list();

        setVoilationReport(
          res.data.map((r) => ({
            label: ` Reported to: ${
              r.officerAssignmentId?.trafficOfficerId?.fName
            } ${r.officerAssignmentId?.trafficOfficerId?.mName}| Voilated: ${
              r.ruleID?.title
            } | ${dayjs(r.createdAt).format("YYYY-MM-DD")}`,
            value: r._id,
            reason: r.ruleID?.title,
            driverId: r.ticketId?.programId?.driverId?._id,
            driverName: r.ticketId
              ? `${r.ticketId?.programId?.driverId?.fName} ${r.ticketId?.programId?.driverId?.mName} ${r.ticketId?.programId?.driverId?.lName}`
              : "NA",
          })),
        );
        // console.log("Passengers for ticket modal:", voilationReport);
      } catch (err) {
        toast.error("Error loading passengers");
      }
    };

    fetchReport();
  }, []);

  const onFinish = async (values) => {
    try {
      await penalityServices.create({
        reportId: values.reportId,
        driverId: values.driverId,
        reason: values.reason,
        amount: values.amount,
      });
      toast.success("Penality Saved");
      queryClient.invalidateQueries(["reports"]);
      queryClient.invalidateQueries(["penalities"]);
      onClose();
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message || "Penality failed");
    }
  };

  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      title="Register Penality"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* READ-ONLY PROGRAM FIELD */}
        <Form.Item label="Rout & Car Information">
          <Input value={reportLabel} disabled />
        </Form.Item>

        <Form.Item
          label="Report Information"
          name="reportId"
          rules={[{ required: true }]}
        >
          <Select
            options={voilationReport}
            placeholder="Select Report"
            onChange={(reportId) => {
              const selectedR = voilationReport.find(
                (r) => r.value === reportId,
              );

              if (selectedR) {
                form.setFieldsValue({
                  reason: selectedR.reason,
                  driverId: selectedR.driverId,
                  driverName: selectedR.driverName,
                });
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Penality Reason"
          name="reason"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Driver License Number"
          name="driverName"
          rules={[{ required: true }]}
        >
          <Input placeholder="enter driver license number" />
        </Form.Item>
        <Form.Item
          label="Driver Id"
          name="driverId"
          rules={[{ required: true }]}
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Penality Amount"
          name="amount"
          rules={[{ required: true }]}
        >
          <Input placeholder="enter amount in birr" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Save Penality
        </Button>
      </Form>
    </Modal>
  );
}
