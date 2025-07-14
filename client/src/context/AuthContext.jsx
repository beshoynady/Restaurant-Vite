import react, { useState, useEffect, useMemo, createContext, useContext } from "react";
import axios from "axios";

const AuthContext =createContext();
export const useAuth = useContext(AuthContext);

export const AuthProvider = ({Children})=>{
const [isLogin, setisLogin] = useState(false);

  const [permissionsList, setPermissionsList] = useState([]);
  const [employeeLoginInfo, setEmployeeLoginInfo] = useState(null);

  const [isTokenValid, setIsTokenValid] = useState(true);

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/employee/refresh-token`,
        {},
        { withCredentials: true }
      );

      if (response && response.data.accessToken) {
        localStorage.setItem("token_e", response.data.accessToken);
        return response.data.accessToken;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      toast.error("انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.");
      return <Navigate to="/login" />;
    }
  };

  const verifyToken = async () => {
    const employeeToken = localStorage.getItem("token_e");
    if (!employeeToken) {
      await refreshToken();
    } else {
      const decodedToken = jwt_decode(employeeToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        await refreshToken();
      }
    }
  };

  const getUserInfoFromToken = async () => {
    const employeeToken = localStorage.getItem("token_e");

    if (!employeeToken) {
      toast.error("رجاء تسجيل الدخول مره أخرى");
      setIsTokenValid(false);
      return;
    }

    try {
      let decodedToken = null;

      if (employeeToken) {
        decodedToken = jwt_decode(employeeToken);
        setEmployeeLoginInfo(decodedToken);
        await getPermissions(decodedToken);
      }

      setIsTokenValid(true);
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("خطأ أثناء التحقق من التوكن. يرجى تسجيل الدخول مرة أخرى.");
      setIsTokenValid(false);
    }
  };

  const getPermissions = async (decodedToken) => {
    try {
      const id = decodedToken.id;
      const config = await handleGetTokenAndConfig();
      if (id) {
        const response = await axios.get(
          `${apiUrl}/api/permission/employee/${id}`,
          config
        );
        if (response.status === 200) {
          const data = response.data.Permissions;
          setPermissionsList(data);
        } else {
          throw new Error(
            "Failed to fetch permissions: Unexpected status code"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching permissions:", error.message);
    }
  };
  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      await verifyToken();
      await getUserInfoFromToken();
      setIsLoading(false);
    };

    initializeSession();
  }, []);

    return (
        <AuthContext.Provider >
            {Children}
        </AuthContext.Provider>
    )
}