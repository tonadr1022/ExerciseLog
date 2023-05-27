/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axiosInstance from "../axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const loginUser = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.post(`token/`, {
      email: e.target.email.value.trim(),
      password: e.target.password.value.trim(),
    });
    if (response.status === 200) {
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));
    }
    localStorage.setItem("authTokens", JSON.stringify(response.data));
    axiosInstance.defaults.headers["Authorization"] =
      "JWT " + response.data.access;
    navigate("/");
  };
  const logoutUser = async () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    axiosInstance.defaults.headers["Authorization"] = null;
    navigate("/login");
  };

  const updateToken = async () => {
    console.log("update token called");
    const response = await axiosInstance.post("token/refresh/", {
      refresh: authTokens.refresh,
    });

    if (response.status === 200) {
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));
      localStorage.setItem("authTokens", JSON.stringify(response.data));
      axiosInstance.defaults.headers["Authorization"] =
        "JWT " + response.data.access;
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const fourMin = 1000 * 60 * 4;
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMin);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
