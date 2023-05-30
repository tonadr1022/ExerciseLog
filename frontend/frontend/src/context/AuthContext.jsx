/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axiosInstance from "../axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`token/`, {
        email: e.target.email.value.trim(),
        password: e.target.password.value.trim(),
      });
      if (response.status === 200) {
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + response.data.access;
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutUser = async () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    axiosInstance.defaults.headers["Authorization"] = null;
    navigate("/login");
  };
  let isRefreshing = false;

  const updateToken = async () => {
    if (isRefreshing) {
      return;
    }
    isRefreshing = true;

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/refresh/",
        { refresh: authTokens?.refresh },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      console.log(response);
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
    } catch (error) {
      console.log(error);
      logoutUser();
    } finally {
      isRefreshing = false;
    }
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading && authTokens) {
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
      {/* {loading ? null : children} */}
      {!loading || !authTokens ? children : null}
    </AuthContext.Provider>
  );
};
