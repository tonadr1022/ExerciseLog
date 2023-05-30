import axiosInstance from "../axios";

export const getExercises = async () => {
  const response = await axiosInstance.get("/exercises");
  console.log(response);
};

export const addExercise = async (exercise) => {
  return await axiosInstance.post("/exercises", exercise);
};

export const updateExercise = async (exercise) => {
  return await axiosInstance.put(`/exercises/${exercise.id}`, exercise);
};

export const deleteExercise = async ({ id }) => {
  return await axiosInstance.delete(`exercises/${id}`, id);
};
