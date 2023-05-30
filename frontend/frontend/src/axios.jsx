import axios from "axios";
// import AuthContext from "./context/AuthContext";
// import { useContext } from "react";

// const {authTokens} = useContext(AuthContext)
const baseURL = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: JSON.parse(localStorage.getItem("authTokens"))
      ? "JWT " + JSON.parse(localStorage.getItem("authTokens")).access
      : null,
  },
});

export default axiosInstance;
