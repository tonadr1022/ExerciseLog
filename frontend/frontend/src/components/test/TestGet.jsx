import axiosInstance from "../../axios";

function TestGet() {
  //   const { data, loading, error } = useGetRequest("exersises/");
  axiosInstance.get("shoes/", { withCredentials: true });
  return;
}

export default TestGet;
