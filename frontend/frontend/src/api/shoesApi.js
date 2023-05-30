import axiosInstance from "../axios";

export const getShoes = async () => {
  const response = await axiosInstance.get("shoes/");
  return response.data;
};

export const addShoe = async (shoe) => {
  return await axiosInstance.post("shoes/", shoe);
};

export const updateShoe = async (shoe) => {
  return await axiosInstance.put(`shoes/${shoe.id}/`, shoe);
};

export const deleteShoe = async (id) => {
  return await axiosInstance.delete(`shoes/${id}/`, id);
};
