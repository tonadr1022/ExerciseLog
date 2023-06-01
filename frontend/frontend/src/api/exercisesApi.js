import axiosInstance from "../axios";
import { formatPace } from "../utils/FormatContent";
import { formatDuration } from "../utils/FormatContent";

export const getAllExercises = async () => {
  const response = await axiosInstance.get("exercises/");
  const formattedExercises = response.data.map((exerciseRow) => {
    exerciseRow.formatted_date = new Date(
      exerciseRow.datetime_started
    ).toLocaleDateString();
    exerciseRow.formatted_time = new Date(
      exerciseRow.datetime_started
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    exerciseRow.pace = formatPace(exerciseRow.pace);
    exerciseRow.duration = formatDuration(exerciseRow.duration);
    delete exerciseRow.datetime_started;
    console.log("all ex", exerciseRow);
    return exerciseRow;
  });
  return formattedExercises;
};

export const getUserExercises = async () => {
  const response = await axiosInstance.get("user-exercises/");
  const formattedExercises = response.data.map((exerciseRow) => {
    exerciseRow.formatted_date = new Date(
      exerciseRow.datetime_started
    ).toLocaleDateString();
    exerciseRow.formatted_time = new Date(
      exerciseRow.datetime_started
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    exerciseRow.pace = formatPace(exerciseRow.pace);
    exerciseRow.duration = formatDuration(exerciseRow.duration);
    delete exerciseRow.datetime_started;
    console.log("user ex", exerciseRow);
    return exerciseRow;
  });
  return formattedExercises;
};

export const addExercise = async (exercise) => {
  return await axiosInstance.post("user-exercises/", exercise);
};

export const updateExercise = async ({ exercise, id }) => {
  return await axiosInstance.put(`user-exercises/${id}/`, exercise);
};

export const deleteExercise = async (id) => {
  return await axiosInstance.delete(`user-exercises/${id}/`, id);
};
