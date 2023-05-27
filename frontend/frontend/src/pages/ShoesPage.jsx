import { useEffect, useState } from "react";
import ShoeCard from "../components/display/ShoeCard";
import useGetRequest from "../requests/useGetRequest";

const API_URL = "http://127.0.0.1:8000/api/shoes/";

const ShoesPage = () => {
  const [shoeData, setShoeData] = useState([]);
  const { data } = useGetRequest(API_URL);
  useEffect(() => {
    if (data) {
      setShoeData(data);
    }
  }, [data]);
  console.log(shoeData);
  return <ShoeCard />;
};

export default ShoesPage;
