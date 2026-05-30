import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  ticketService,
  passengerServices,
} from "../../admin/common/makeServices";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function TicketModal({ program, onClose }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [passenger, setPassenger] = useState([]);

  // Build display label once
  const programLabel = `${program.routId?.departure} → ${
    program.routId?.arrival
  } | ${program.carId?.type || " "} - ${
    program.carId?.level || " "
  }  |  ${dayjs(program.date).format("YYYY-MM-DD")}`;

  // Auto-fill on open
  useEffect(() => {
    form.setFieldsValue({
      programId: program._id,
      programDisplay: programLabel,
    });
  }, [program]);

  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        const res = await passengerServices.list();

        setPassenger(
          res.data.map((p) => ({
            label: `${p.fName} ${p.mName} ${p.lName} | ${p._id}`,
            value: p._id,
            name: `${p.fName} ${p.mName} ${p.lName}`,
            email: p.email,
            phone: p.phone,
          })),
        );
        // console.log("Passengers for ticket modal:", res.data);
      } catch (err) {
        toast.error("Error loading passengers");
      }
    };

    fetchPassenger();
  }, []);

  const onFinish = async (values) => {
    try {
      await ticketService.create({
        passengerId: values.passengerId,
        programId: program._id,
        purchaseDate: program.date, // VERY IMPORTANT
        passengerName: values.passengerName,
        email: values.email,
        phone: values.phone,
      });
      toast.success("Ticket Reserved");
      queryClient.invalidateQueries(["programs"]);
      queryClient.invalidateQueries(["ticketes"]);
      onClose();
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message || "Reservation failed");
    }
  };

  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      title="Reserve Ticket"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* READ-ONLY PROGRAM FIELD */}
        <Form.Item label="Program">
          <Input value={programLabel} disabled />
        </Form.Item>

        <Form.Item
          label="Passenger ID"
          name="passengerId"
          rules={[{ required: true }]}
        >
          <Select
            options={passenger}
            placeholder="Select Passenger"
            onChange={(passengerId) => {
              const selectedP = passenger.find((p) => p.value === passengerId);

              if (selectedP) {
                form.setFieldsValue({
                  passengerName: selectedP.name,
                  email: selectedP.email,
                  phone: selectedP.phone,
                });
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Passenger Name"
          name="passengerName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: false, type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: false }]}>
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Reserve
        </Button>
      </Form>
    </Modal>
  );
}
