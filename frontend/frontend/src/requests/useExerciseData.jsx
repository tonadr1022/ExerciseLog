import { useState, useEffect } from "react";
import useGetRequest from "./useGetRequest";
import { formatDuration, formatPace } from "../utils/FormatContent";

const API_URL = "exercises/";

const useExerciseData = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const { data, loading, error } = useGetRequest(API_URL);
  useEffect(() => {
    if (data) {
      const formattedExercises = data.map((exerciseRow) => {
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
        }
        return formattedRow;

        // temperature: exerciseRow.weather.temperature,
        //humidity: exerciseRow.weather.humidity,
        // feels_like: exerciseRow.weather.feels_like,
      });
      //
      // "id": 4,
      //         "user": 10,
      //         "name": "postman",
      //         "act_type": "Run",
      //         "workout_type": "Standard",
      //         "datetime_started": "2023-05-11T22:27:00-05:00",
      //         "duration": null,
      //         "distance": "11.00",
      //         "pace": null,
      //         "rating": 8,
      //         "notes": "happy blah blah",
      //         "log_notes": null,
      //         "location": "Green bay",
      //         "shoe": "Anthony",
      //         "weather": {
      //             "id": 2,
      //             "datetime": "2023-05-12T03:27:00Z",
      //             "temperature": 63.03,
      //             "humidity": 57,
      //             "feels_like": 61.72
      //         }
      setExerciseData(formattedExercises);
    }
  }, [data]);
  return { exerciseData, loading, error };
};

export default useExerciseData;
