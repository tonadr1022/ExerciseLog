import { useState, useEffect } from "react";
import useGetRequest from "./useGetRequest";
import { formatDuration, formatPace } from "../utils/FormatContent";

const API_URL = "exercises/";

const useExerciseData = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const { data, loading, error } = useGetRequest(API_URL);
  useEffect(() => {
    if (data) {
      const formattedExercises = data.map((ExerciseRow) => {
        const formattedDate = new Date(
          ExerciseRow.datetime_started
        ).toLocaleDateString();
        const formattedTime = new Date(
          ExerciseRow.datetime_started
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedPace =
          ExerciseRow.pace === null ? null : formatPace(ExerciseRow.pace);
        const formattedDuration =
          ExerciseRow.duration === null
            ? null
            : formatDuration(ExerciseRow.duration);
        return {
          name: ExerciseRow.name,
          act_type: ExerciseRow.act_type,
          workout_type: ExerciseRow.workout_type,
          formatted_date: formattedDate,
          formatted_time: formattedTime,
          duration: formattedDuration,
          distance: ExerciseRow.distance,
          pace: formattedPace,
        };
      });

      setExerciseData(formattedExercises);
    }
  }, [data]);

  return { exerciseData, loading, error };
};

export default useExerciseData;
