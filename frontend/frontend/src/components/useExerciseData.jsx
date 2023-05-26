import { useState, useEffect } from "react";
import useFetch from "./useFetch";
import { formatDuration, formatPace } from "../utils/FormatContent";

const API_URL = "http://127.0.0.1:8000/api/exercises/";

const useExerciseData = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const { data, loading, error } = useFetch(API_URL);
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
