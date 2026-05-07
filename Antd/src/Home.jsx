import React from "react";
import {
  Layout,
  Menu,
  Button,
  Carousel,
  Card,
  Row,
  Col,
  BackTop,
  FloatButton,
  Typography,
  Modal,
  Form,
  Table,
  Input,
  Select,
  Divider,
} from "antd";
import {
  BuildOutlined,
  LoginOutlined,
  SettingOutlined,
  FilterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "./css/Home.css";
import "./css/ResponsiveCaruosel.css";
import { Link } from "react-router-dom";

import { data, Navigate, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

import logo from "./assets/logo_circle.png";
import image1 from "./assets/traffic/image1.png";
import image2 from "./assets/traffic/image2.png";
import image3 from "./assets/traffic/image3.png";
import image4 from "./assets/traffic/image4.png";
import image5 from "./assets/traffic/image5.png";
import image6 from "./assets/traffic/image6.png";
import image7 from "./assets/traffic/image7.png";
import image8 from "./assets/traffic/image8.png";
import image9 from "./assets/traffic/image9.png";
import image10 from "./assets/traffic/image10.png";
import image11 from "./assets/traffic/image11.png";

import { routService } from "./admin/common/makeServices.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  tarrifByRoute,
  programByRoute,
  programSearch,
  tarrifSearch,
} from "./admin/common/makeServices.js";
import "./admin/css/TableCSS.css";
// ....... end of imports

const { Search } = Input;
const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
function Home() {
  //   const columnTitleWithLeftFilter = (title, filtered) => (
  //   <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
  //     <FilterOutlined
  //       style={{
  //         color: filtered ? "#1677ff" : "#999",
  //         fontSize: 14,
  //       }}
  //     />
  //     <span>{title}</span>
  //   </div>
  // );

  const queryClient = useQueryClient();
  const images = [image10, image2, image3, image4, image11];
  const [login, setLogin] = useState();
  const navigate = useNavigate();
  const { userData, backendURL, setUserData, setIsloggedIn } =
    useContext(AppContext);
  const backURL = import.meta.env.VITE_BACKEND_URL;

  const [openModal, setOpenModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [tarrifs, setTarrifs] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [viewType, setViewType] = useState(null); // "tarrif" | "program"
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(10);
  const [careLevelFilters, setCareLevelFilters] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [route, setRoutes] = useState([]);
  const [companyRoutes, setCompanyRoutes] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [searching, setSearching] = useState(false);

  const getcompany = async () => {
    try {
      const { data } = await axios.get(`${backURL}/getCompany`);

      if (!data) {
        toast.error(message, "Company List not found!.");
      } else {
        setCompanies(data);
      }
    } catch (error) {
      // console.log(err);
      toast.error(message, "Company List not Found!.");
    }
  };

  useEffect(() => {
    getcompany();
  }, []);

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ["routsforHome"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${backendURL}/routsforHome`);
        return res.data || [];
      } catch (error) {
        toast.error(String(error) || "unable to list the records");
        throw error;
      }
    },
  });

  const tarrifDetail = async (route) => {
    setOpenModal(true);
    setSelectedRoute(route);
    setViewType("tarrif");
    setLoading(true);
    try {
      const tarrifRes = await tarrifByRoute.getTarrifByRoute(route._id);
      setTarrifs(tarrifRes.data);
      console.log("API RESPONSE:", tarrifRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load route details");
    }
  };

  const programDetail = async (route) => {
    setOpenModal(true);
    setSelectedRoute(route);
    setViewType("program");
    setLoading(true);
    try {
      const programRes = await programByRoute.getprogramByRoute(route._id);
      setPrograms(programRes.data);
      // extract unique care levels
      const uniqueLevels = [
        ...new Set(programRes.data.map((p) => p.carId?.level).filter(Boolean)),
      ];

      // convert to AntD filter format
      const filters = uniqueLevels.map((level) => ({
        text: level,
        value: level,
      }));

      setCareLevelFilters(filters);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load route details");
    }
  };

  const tarrifColumns = [
    {
      title: "Route",
      key: "route",
      render: (_, record) =>
        record.routId
          ? `${record.routId.departure} ⇄ ${record.routId.arrival}`
          : "—",
    },
    {
      title: "Car Type",
      key: "carType",
      render: (_, record) => record.carId?.type || "—",
      sorter: (a, b) =>
        (a.carId?.type || "").localeCompare(b.carId?.type || ""),
    },
    {
      title: "Care Level",
      key: "careLevel",
      render: (_, record) => record.carId?.level || "—",
      sorter: (a, b) =>
        (a.carId?.level || "").localeCompare(b.carId?.level || ""),
    },
    {
      title: "Tarrif (ETB)",
      dataIndex: "amount",
      key: "amount",
      render: (v) => `${v}`,
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  const programColumns = [
    {
      title: "Route",
      key: "route",
      render: (_, record) =>
        record.routId
          ? `${record.routId.departure} ⇄ ${record.routId.arrival}`
          : "—",
    },
    {
      title: "Car Type",
      key: "carType",
      render: (_, record) => record.carId?.type || "—",
      sorter: (a, b) =>
        (a.carId?.type || "").localeCompare(b.carId?.type || ""),
    },
    {
      title: "Care Level",
      key: "careLevel",

      filters: careLevelFilters,
      onFilter: (value, record) => record.carId?.level === value,

      render: (_, record) => record.carId?.level || "—",
      sorter: (a, b) =>
        (a.carId?.level || "").localeCompare(b.carId?.level || ""),
    },
    {
      title: "Queue",
      dataIndex: "queue",
      key: "queue",
      render: (v) => `${v}`,
      sorter: (a, b) => a.queue - b.queue,
    },
    {
      title: "Tarrif (ETB)",
      dataIndex: "tarrif",
      key: "tarrif",
      render: (v) => `${v}`,
      sorter: (a, b) => a.tarrif - b.tarrif,
    },
  ];
  const actionColumn = {
    title: "View Details",
    key: "action",
    fixed: "right",
    width: 80,
    align: "center",
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => alert(`Action on ${record._id}`)}
        icon={<EyeOutlined />}
      ></Button>
    ),
  };

  const tableColumns =
    viewType === "tarrif" ? tarrifColumns : [...programColumns, actionColumn];
  const tableData = viewType === "tarrif" ? tarrifs : programs;

  const handleCompanyChange = async (companyId) => {
    setSelectedCompany(companyId);

    if (!companyId) {
      setDeparture("");
      setArrival("");
      return;
    }

    const res = await axios.get(`${backendURL}/routByCompany/${companyId}`);

    setCompanyRoutes(res.data);

    // Auto-fill first available route
    if (res.data.length > 0) {
      setDeparture(res.data[0].departure);
      setArrival(res.data[0].arrival);
    }
  };
  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await axios.get(`${backendURL}/searchRout`, {
        params: {
          companyId: selectedCompany,
          departure,
          arrival,
        },
      });

      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout className="homepage-layout">
      {/* Header */}
      <Header className="homepage-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <Text className="TMS">
            Transport Management System
            <span className="spanHeader">(TMS)</span>
          </Text>
        </div>

        <div className="header-center">
          <Menu
            mode="horizontal"
            selectable={false}
            items={[
              { key: "1", label: "Home" },
              { key: "2", label: "About" },
              { key: "3", label: "Services" },
              { key: "4", label: "Contact" },
            ]}
          />
        </div>

        <div className="header-right">
          <Menu
            onClick={(items) => {
              navigate(items.key);
            }}
            items={[
              {
                label: "Create Company",
                key: "/HomeSetting",
                icon: <SettingOutlined />,
              },
            ]}
          ></Menu>
          <Menu
            onClick={(items) => {
              navigate(items.key);
            }}
            items={[
              {
                label: "Login",
                key: "/IndexPage",
                icon: <LoginOutlined />,
              },
            ]}
          ></Menu>
        </div>
      </Header>

      {/* Body */}
      <Content className="homepage-content">
        {/* Carousel */}
        <Carousel autoplay className="homepage-carousel">
          <Carousel autoplay dotPosition="bottom">
            {images.map((src, index) => (
              <div key={index} className="carousel-slide">
                <img src={src} alt={`slide-${index}`} />
              </div>
            ))}
          </Carousel>
        </Carousel>

        {/* News & Articles */}
        <div className="cards-section">
          {/* ....... searching services ...... */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Select
                placeholder="Select Company"
                style={{ width: "100%" }}
                onChange={handleCompanyChange}
                allowClear
              >
                {companies.map((c) => (
                  <Select.Option key={c._id} value={c._id}>
                    {c.companyName}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col span={6}>
              <Input
                placeholder="Departure"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </Col>

            <Col span={6}>
              <Input
                placeholder="Arrival"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
              />
            </Col>

            <Col span={6}>
              <Button type="primary" block onClick={handleSearch}>
                Search Routes
              </Button>
            </Col>
          </Row>
          {searching && (
            <Row gutter={[16, 16]}>
              {route.map((route, index) => (
                <Col xs={24} sm={12} md={8} lg={8} key={index}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={`Transport ${index}`}
                        src="https://picsum.photos/id/1015/1200/600"
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <Button
                          type="link"
                          title={`${route.departure}  ⇄  ${route.arrival}`}
                          onClick={() => tarrifDetail(route)}
                          style={{ fontSize: "16px", fontWeight: "bold" }}
                        >
                          {`${route.departure}  ⇄  ${route.arrival}`}
                        </Button>
                      }
                      description={
                        <Button
                          type="link"
                          onClick={() => programDetail(route)}
                        >
                          Active Rout Programs
                        </Button>
                      }
                    />
                  </Card>
                </Col>
              ))}
              <Divider>Above are Searched results</Divider>
            </Row>
          )}
          <Row gutter={[16, 16]}>
            {routes.map((route, index) => (
              <Col xs={24} sm={12} md={8} lg={8} key={index}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={`Transport ${index}`}
                      src="https://picsum.photos/id/1015/1200/600"
                    />
                  }
                >
                  <Card.Meta
                    title={
                      <Button
                        type="link"
                        title={`${route.departure}  ⇄  ${route.arrival}`}
                        onClick={() => tarrifDetail(route)}
                        style={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        {`${route.departure}  ⇄  ${route.arrival}`}
                      </Button>
                    }
                    description={
                      <Button type="link" onClick={() => programDetail(route)}>
                        Active Rout Programs
                      </Button>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="homepage-footer">
        <div className="footer-top">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <h3>About Us</h3>
              <p>
                We provide transport management solutions to improve traffic and
                logistics efficiency.
              </p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <h3>Quick Links</h3>
              <ul>
                <li>Home</li>
                <li>Services</li>
                <li>Contact</li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <h3>Contact</h3>
              <p>Email: info@transport.com</p>
              <p>Phone: +123 456 789</p>
            </Col>
          </Row>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Transport Management System. All Rights
          Reserved.
        </div>
      </Footer>

      {/* Back to Top */}
      <FloatButton.BackTop />
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 700 }}
      >
        {/* {viewType === "tarrif" && ( */}
        <>
          {/* HEADER ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              marginRight: 20,
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              {viewType === "tarrif" ? "Tarrifs" : "Programs"}
            </Title>

            {/* 🔍 GLOBAL SEARCH */}
            <Search
              style={{ maxWidth: 220, fontSize: 8 }}
              placeholder="Search ..."
              allowClear
              onSearch={async (value) => {
                try {
                  if (viewType === "tarrif") {
                    const res = await tarrifSearch.getTarrifByRoute(
                      selectedRoute._id,
                      value,
                    );
                    setTarrifs(res.data);
                  } else {
                    const res = await programSearch.getprogramByRoute(
                      selectedRoute._id,
                      value,
                    );
                    setPrograms(res.data);
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Search failed");
                }
              }}
            />
          </div>
          <Table
            bordered
            size="small"
            className="compactTable stripedTable coloredHeader"
            rowClassName={(_, index) =>
              index % 2 === 0 ? "rowColerOne" : "rowColerTwo"
            }
            columns={tableColumns}
            dataSource={tableData}
            rowKey="_id"
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: [
                "5",
                "10",
                "20",
                "50",
                "100",
                "150",
                "200",
                "250",
                "300",
              ],
              defaultPageSize: 10,
              position: ["bottomRight"],
            }}
          />
        </>

        {/* {viewType === "program" && (
    <>
      <Title level={5}>Programs</Title>
      <Table
      bordered
        size="small"
        className="compactTable stripedTable coloredHeader"
        rowClassName={(_, index) =>
          index % 2 === 0 ? "rowColerOne" : "rowColerTwo"
        }
        columns={programColumns}
        dataSource={programs}
        rowKey="_id"
         pagination={{
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50","100","150","200","250","300"],
    defaultPageSize: 10,
    position: ["bottomRight"],
  }}
      />
    </>
  )} */}
      </Modal>
    </Layout>
  );
}

export default Home;
