import { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const { getUserData, setIsloggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const user = await getUserData();
      if (user) setIsloggedIn(true);
      navigate("/adminDashboard");
    };
    init();
  }, []);

  return <div>Loading...</div>;
};

export default GoogleSuccess;
