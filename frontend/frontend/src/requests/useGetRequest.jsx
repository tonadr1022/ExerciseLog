import { useEffect, useState } from "react";
import axiosInstance from "../axios";

const useGetRequest = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [url]);

  return { data, loading, error };
};

export default useGetRequest;
