import React, { useContext, useState, useEffect } from "react";
import "./Login.css";
import { dataContext } from "../../../../App";
import { toast } from "react-toastify";
import axios from "axios";

import restaurant from "../../../../image/SmartRestaurant.jpg";
import menu from "../../../../image/emenu.jpg";
import pos from "../../../../image/pos.jpg";

const Login = () => {
  const {
    getUserInfoFromToken,
    setIsLoading, handleGetTokenAndConfig, apiUrl } = useContext(dataContext)

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showCreateButton, setShowCreateButton] = useState(false);

  const checkIfEmployeesExist = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employee/count`);
      console.log({ response });
      const count = response.data ? response.data.count : 0;
      if (count === 0) {
        setShowCreateButton(true);
      }
      console.log({ count });
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("حدث خطأ في الشبكة.");
      setShowCreateButton(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfEmployeesExist();
  }, []);

  const adminLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("ادخل رقم الموبايل و الباسورد بشكل صحيح");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/employee/login`,
        {
          phone,
          password,
        },
        { withCredentials: true }
      );
      if (response && response.data) {
        const { data } = response;
        toast.success("تم تسجيل الدخول بنجاح");
        if (data.accessToken) {
          localStorage.setItem("token_e", data.accessToken);
          getUserInfoFromToken();
        }
        if (data.findEmployee.isActive === true) {
          window.location.href = `https://${window.location.hostname}/management`;
        } else {
          toast.error("غير مسموح لك بالدخول");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "حدث خطأ. الرجاء المحاولة مرة أخرى."
      );
    }
  };

  const handleCreateFirstEmployee = async () => {
    try {
      const fristEmployee = await axios.post(
        `${apiUrl}/api/employee/create-first`
      );
      console.log({ fristEmployee });
      toast.success("تم إنشاء أول موظف بنجاح");
      checkIfEmployeesExist();
    } catch (error) {
      console.error("Error creating first employee:", error);
      toast.error("حدث خطأ أثناء إنشاء أول موظف.");
    }
  };

  return (
    <section className="login-body">
      <div className="container h-100">
        <div className="login-box">
          <div className="col-12 col-md-6 d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-wrap align-items-center justify-content-center">
              <div className="logo">
                <span className="logo-font">Smart</span> Menu
              </div>
              <div className="app-description">
                <p>
                  أدخل رقم هاتفك وكلمة المرور للوصول إلى تطبيق Smart Menu
                  <pr />
                  الذي يمكنك من إدارة أقسام مطعمك بسهولة والتحكم الشامل في
                  عملياته.
                </p>
              </div>
            </div>
            {showCreateButton === true ? (
              <div className="col-12 d-flex flex-column flex-wrap align-items-center justify-content-center mt-3">
                <button
                  onClick={handleCreateFirstEmployee}
                  className="btn btn-success p-3"
                >
                  خاص بالمبرمج
                </button>
              </div>
            ) : (
              <div className="col-12 d-flex flex-column flex-wrap align-items-center justify-content-between">
                <h3 className="header-title">سجل دخول</h3>
                <form className="login-form" onSubmit={adminLogin}>
                  <div className="form-group w-100 h-auto px-3 d-flex align-items-center justify-content-start col-12">
                    <input
                      type="text"
                      className="form-control border-primary m-0 p-2 h-auto"
                      placeholder="الهاتف"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group w-100 h-auto px-3 d-flex align-items-center justify-content-start col-12">
                    <input
                      type="password"
                      className="form-control border-primary m-0 p-2 h-auto"
                      placeholder="كلمة المرور"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group w-100 h-auto px-3 d-flex align-items-center justify-content-center col-12">
                    <button
                      type="submit"
                      className="h-100 btn btn-primary btn-block"
                    >
                      تسجيل دخول
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center d-none d-md-block h-100">
            <div id="demo" className="carousel slide" data-ride="carousel">
              {/* Indicators */}
              <ul className="carousel-indicators">
                <li
                  data-target="#demo"
                  data-slide-to="0"
                  className="active"
                ></li>
                <li data-target="#demo" data-slide-to="1"></li>
                <li data-target="#demo" data-slide-to="2"></li>
              </ul>

              {/* The slideshow */}
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="slider-feature-card">
                    <img
                      className="d-block w-100 carousel-image"
                      src={restaurant}
                      alt="Smart Management"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h3 className="slider-title">إدارة المطعم بذكاء</h3>
                      <p className="slider-description">
                        إدارة مطعمك بشكل ذكي وحديث باستخدام تطبيق Smart Menu
                        لتسهيل جميع عملياتك.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="slider-feature-card">
                    <img
                      className="d-block w-100 carousel-image"
                      src={menu}
                      alt="Electronic Menu"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h3 className="slider-title">
                        منيو إلكتروني سهل الإدارة
                      </h3>
                      <p className="slider-description">
                        تحكم في قائمة الطعام إلكترونيًا بمرونة وسهولة مع تحديثات
                        لحظية وإدارة فعالة.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="slider-feature-card">
                    <img
                      className="d-block w-100 carousel-image"
                      src={pos}
                      alt="Cloud-Based Service"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h3 className="slider-title">خدمة سحابية متكاملة</h3>
                      <p className="slider-description">
                        استقبال وإرسال الطلبات عبر السحابة، مع تقديم تجربة سلسة
                        ومتصلة باستخدام تطبيق Smart Menu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left and right controls */}
              <a
                className="carousel-control-prev"
                href="#demo"
                data-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </a>
              <a
                className="carousel-control-next"
                href="#demo"
                data-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
