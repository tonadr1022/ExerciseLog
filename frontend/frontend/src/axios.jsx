import axios from "axios";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";

// const {authTokens} = useContext(AuthContext)
const baseURL = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: JSON.parse(localStorage.getItem("authTokens"))
      ? "JWT " + JSON.parse(localStorage.getItem("authTokens")).access
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // if response type is undefined, the server is disconnected because it doesn't provide a response
//     if (typeof error.response === "undefined") {
//       alert("Server error occurred. We will get it fixed shortly.");
//       return Promise.reject(error);
//     }

//     if (error.response.status === 401) {
//       console.log("original", originalRequest);
//       console.log("error", error);
//       localStorage.getItem("access_token");
//       // window.location.href = "/login/";
//       // return Promise.reject(error);
//     }
//   }
// );
//Adapted from https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async function (error) {
//     const originalRequest = error.config;

//     // if not connected to server,
//     if (typeof error.response === "undefined") {
//       alert(
//         "A server/network error occurred. " +
//           "Looks like CORS might be the problem. " +
//           "Sorry about this - we will get it fixed shortly."
//       );
//       return Promise.reject(error);
//     }

//     // if tokens are out of date and the request came from a refresh,
//     // send to login
//     if (
//       error.response.status === 401 &&
//       originalRequest.url === baseURL + "token/refresh/"
//     ) {
//       window.location.href = "/login/";
//       return Promise.reject(error);
//     }
//     // other unauthorized requests --> set the refresh token
//     if (
//       error.response.data.code === "token_not_valid" &&
//       error.response.status === 401 &&
//       error.response.statusText === "Unauthorized"
//     ) {
//       const refreshToken = localStorage.getItem("refresh_token");
//       if (refreshToken) {
//         const tokenParts = JSON.parse(window.atob(refreshToken.split(".")[1]));
//         // exp date in token is expressed in seconds, while now() returns milliseconds:
//         const now = Math.ceil(Date.now() / 1000);
//         console.log(tokenParts.exp);

//         if (tokenParts.exp > now) {
//           return axiosInstance
//             .post("/token/refresh/", { refresh: refreshToken })
//             .then((response) => {
//               localStorage.setItem("access_token", response.data.access);
//               localStorage.setItem("refresh_token", response.data.refresh);

//               axiosInstance.defaults.headers["Authorization"] =
//                 "JWT " + response.data.access;
//               originalRequest.headers["Authorization"] =
//                 "JWT " + response.data.access;

//               return axiosInstance(originalRequest);
//             })
//             .catch((err) => {
//               console.log(err);
//             });
//         } else {
//           console.log("Refresh token is expired", tokenParts.exp, now);
//           window.location.href = "/login/";
//         }
//       } else {
//         console.log("Refresh token not available.");
//         window.location.href = "/login/";
//       }
//     }
//     // if (
//     //   error.response.status === 401 &&
//     //   error.response.statusText === "Unauthorized"
//     // ) {
//     //   window.location.href = "/login";
//     // }

//     // specific error handling done elsewhere
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
