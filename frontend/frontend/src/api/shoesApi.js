import axiosInstance from "../axios";

export const getAllShoes = async () => {
  const response = await axiosInstance.get("shoes/");
  return response.data;
};

export const getUserShoes = async () => {
  const response = await axiosInstance.get("user-shoes/");

  return response.data;
};

export const addShoe = async (shoe) => {
  return await axiosInstance.post("user-shoes/", shoe);
};

export const updateShoe = async ({ shoe, id }) => {
  return await axiosInstance.put(`user-shoes/${id}/`, shoe);
};

export const deleteShoe = async (id) => {
  return await axiosInstance.delete(`user-shoes/${id}/`, id);
};
