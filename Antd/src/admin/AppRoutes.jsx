import React from "react";
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Switch } from "antd";
import Home from "../Home.jsx";
import Address from "../adminPages/adminAddresses/Address.jsx";
import Cars from "../adminPages/adminCars/Cars.jsx";
import Drivers from "../adminPages/adminDrivers/Drivers.jsx";
import Owners from "../adminPages/adminOwners/Owners.jsx";
import Penalities from "../adminPages/adminPenalities/Penalities.jsx";
import Polices from "../adminPages/adminPolices/Polices.jsx";
import Programs from "../adminPages/adminPrograms/Programs.jsx";
import Reports from "../adminPages/adminReportes/Reports.jsx";
import Rules from "../adminPages/adminRules/Rules.jsx";
// import IndexPage from "../IndexPage.jsx";
import ResetPassword from "../ResetPassword.jsx";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./Admin.jsx";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import EmailVerify from "../verify/EmailVerify.jsx";
import Login from "../Login.jsx";
import PasswordEntry from "../verify/PasswordEntry.jsx";
import ProvidingOTP from "../verify/ProvidingOTP.jsx";
import GoogleSuccess from "./GoogleSuccess";
import Settings from "./Settings.jsx";
import HomeSetting from "../HomeSetting.jsx";
import PaymentSuccess from "./success/PaymentSuccess.jsx";
import VoilationTable from "../adminPages/voilationReport/VoilationTable.jsx";
import ReportView from "../adminPages/voilationReport/ReportView.jsx";

//... End of Imports
function AppRoutes() {
  const { isLoggedIn } = useContext(AppContext);
  return (
    <div>
      {/* <ToastContainer /> */}
      {/* <BrowserRouter> */}
      <Routes>
        {/* <Route path="/" element={<IndexPage />}></Route> */}
        <Route
          path="/*"
          element={
            isLoggedIn ? <Navigate to="/adminDashboard" replace /> : <Home />
          }
        ></Route>
        <Route path="/IndexPage" element={<Login />}></Route>
        <Route path="/settingPage" element={<Settings />}></Route>
        <Route path="/HomeSetting" element={<HomeSetting />}></Route>
        <Route
          path="/adminDashboard/*"
          element={isLoggedIn ? <Admin /> : <Navigate to="/" replace />}
        ></Route>
        <Route path="/adminhome" element={<Home />}></Route>
        <Route path="/Address" element={<Address />}></Route>
        <Route path="/cars" element={<Cars />}></Route>
        <Route path="/drivers" element={<Drivers />}></Route>
        <Route path="/owners" element={<Owners />}></Route>
        <Route path="/penalities" element={<Penalities />}></Route>
        <Route path="/polices" element={<Polices />}></Route>
        <Route path="/programs" element={<Programs />}></Route>
        <Route path="/rules" element={<Rules />}></Route>
        <Route path="/reports" element={<Reports />}></Route>
        <Route path="/resetPassword" element={<ResetPassword />}></Route>
        <Route path="/emailVerify" element={<EmailVerify />}></Route>
        <Route path="/ResettingOTP" element={<ProvidingOTP />}></Route>
        <Route path="/passwordReset" element={<PasswordEntry />}></Route>
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/payment_success" element={<PaymentSuccess />} />
        <Route path="/violations" element={<VoilationTable />} />
        <Route
          path="/voilationReports/report_view/:reportId"
          element={<ReportView />}
        />
      </Routes>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default AppRoutes;
