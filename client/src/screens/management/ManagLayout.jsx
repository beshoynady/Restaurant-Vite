import React, { useContext } from "react";
import "./ManagLayout.css";
import { dataContext } from "../../App";
import { Navigate, Outlet } from "react-router-dom";
// import { Outlet } from "react-router";
import NavBar from "./manag.component/navbar/NavBar";
import SideBar from "./manag.component/sidebar/SideBar";
import { ToastContainer } from "react-toastify";
import { useShared } from "../../context/SharedContext";
import { useAuth } from "../../context/AuthContext";

const ManagLayout = () => {
  const { employeeLoginInfo } = useAuth();

  const isLoggedIn = employeeLoginInfo?.isAdmin && employeeLoginInfo?.isActive;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="manag-body">
      <ToastContainer />
      <main className="content">
        <NavBar />
        <Outlet />
      </main>
      <SideBar />
    </div>
  );
};

export default ManagLayout;
