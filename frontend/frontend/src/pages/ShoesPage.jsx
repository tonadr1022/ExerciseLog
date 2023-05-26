import { useEffect, useState } from "react";
import ShoeCard from "../components/ShoeCard";
import useFetch from "../components/useFetch";

const API_URL = "http://127.0.0.1:8000/api/shoes/";

const ShoesPage = () => {
  const [shoeData, setShoeData] = useState([]);
  const { data, loading, error } = useFetch(API_URL);
  useEffect(() => {
    if (data) {
      setShoeData(data);
    }
  }, [data]);
  console.log(shoeData);
  return <ShoeCard />;
};

export default ShoesPage;
