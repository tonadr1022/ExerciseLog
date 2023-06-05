import axiosInstance from "../axios";
import { useQuery } from "@tanstack/react-query";

export const getMap = async (mapId) => {
  if (mapId) {
    const data = await axiosInstance.get(`map/${mapId}`);
    console.log("data", data.data);
    return data.data;
  } else {
    return null;
  }
};
