import axiosInstance from "../axios";
import { formatPace } from "../utils/FormatContent";
import { formatDuration } from "../utils/FormatContent";

export const getExercises = async () => {
  const response = await axiosInstance.get("exercises/");
  const formattedExercises = response.data.map((exerciseRow) => {
    const formattedDate = new Date(
      exerciseRow.datetime_started
    ).toLocaleDateString();
    const formattedTime = new Date(
      exerciseRow.datetime_started
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedPace =
      exerciseRow.pace === null ? null : formatPace(exerciseRow.pace);
    const formattedDuration =
      exerciseRow.duration === null
        ? null
        : formatDuration(exerciseRow.duration);
    let formattedRow = {
      id: exerciseRow.id,
      name: exerciseRow.name,
      act_type: exerciseRow.act_type,
      workout_type: exerciseRow.workout_type,
      formatted_date: formattedDate,
      formatted_time: formattedTime,
      duration: formattedDuration,
      distance: exerciseRow.distance,
      pace: formattedPace,
      rating: exerciseRow.rating,
      notes: exerciseRow.notes,
      log_notes: exerciseRow.log_notes,
      location: exerciseRow.location,
      shoe: exerciseRow.shoe,
    };
    if (exerciseRow.weather) {
      formattedRow.temperature = exerciseRow.weather.temperature;
      formattedRow.humidity = exerciseRow.weather.humidity;
      formattedRow.feels_like = exerciseRow.weather.feels_like;
      formattedRow.wind_speed = exerciseRow.weather.wind_speed;
      formattedRow.from_current_api = exerciseRow.weather.from_current_api;
      formattedRow.weather_type = exerciseRow.weather.type;
    }
    return formattedRow;
  });
  return formattedExercises;
};

export const addExercise = async (exercise) => {
  return await axiosInstance.post("/exercises/", exercise);
};

export const updateExercise = async ({ exercise, id }) => {
  return await axiosInstance.put(`/exercises/${id}/`, exercise);
};

export const deleteExercise = async (id) => {
  return await axiosInstance.delete(`exercises/${id}/`, id);
};
