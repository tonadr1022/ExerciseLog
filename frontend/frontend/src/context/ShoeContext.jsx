import React from "react";
import { createContext, useState, useEffect } from "react";
import useGetRequest from "../requests/useGetRequest";

const ShoeContext = createContext();

export default ShoeContext;

const API_URL = "http://127.0.0.1:8000/api/shoes/";

export const ShoeProvider = ({ children }) => {
  const [shoeData, setShoeData] = useState([]);
  const { data, loading } = useGetRequest(API_URL);
  const [shoeLoading, setShoeLoading] = useState(loading);
  useEffect(() => {
    if (data) {
      setShoeData(data);
    }
    setShoeLoading(false);
  }, [data]);

  let contextData = {
    shoeData: shoeData,
    setShoeData: setShoeData,
    shoeLoading: shoeLoading,
  };
  return (
    <ShoeContext.Provider value={contextData}>
      {!loading ? children : <div>getting shoes</div>}
    </ShoeContext.Provider>
  );
  //   const ShoeDataFetcher = ({ children }) => {
  //     const [shoeData, setShoeData] = useState([]);
  //     const { data } = useGetRequest(API_URL);
  //     useEffect(() => {
  //       if (localStorage.getItem("authTokens")) {
  //         setShoeData(data);
  //         console.log(data);
  //       }
  //     }, [data]);

  //     return shoeData ? children(shoeData) : children();
  //   };
};
