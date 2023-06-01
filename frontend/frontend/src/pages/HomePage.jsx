import { useQuery } from "@tanstack/react-query";
import { getAllExercises } from "../api/exercisesApi";
import { useState } from "react";
import ExerciseCards from "../components/display/ExerciseCards";
import { Typography, Grid } from "@mui/material";
import ViewToggle from "../components/display/ViewToggle";
import ShoeCards from "../components/display/ShoeCards";
import { getAllShoes } from "../api/shoesApi";
const HomePage = () => {
  const [view, setView] = useState("Exercises");
  const {
    data: exerciseData,
    isLoading: exercisesIsLoading,
    isError: exercisesIsError,
    error: exercisesError,
  } = useQuery(["all_exercises"], getAllExercises, {
    staleTime: 60 * 1000,
  });
  const {
    data: shoeData,
    isLoading: shoesIsLoading,
    isError: shoesIsError,
    error: shoesError,
  } = useQuery(["all_shoes"], getAllShoes, {
    staleTime: 60 * 1000,
  });

  if (exercisesIsError) {
    alert("error loading content", { exercisesError });
    return <Typography variant="h6">ERROR</Typography>;
  }

  const handleViewChange = (event, newView) => {
    if (newView.length) {
      setView(newView);
    }
  };

  if (shoesIsError || exercisesIsError) {
    alert("error occurred", shoesError, exercisesError);
    return <div>Error</div>;
  }

  return (
    <>
      {!exercisesIsLoading && !shoesIsLoading && (
        <Grid container padding={2} spacing={2}>
          <Grid item xs={12}>
            <ViewToggle
              handleChange={handleViewChange}
              view={view}
              firstOption={"Exercises"}
              secondOption={"Shoes"}
            />
          </Grid>
          <Grid item xs={12}>
            {view === "Exercises" ? (
              <ExerciseCards isPersonal={false} exerciseData={exerciseData} />
            ) : (
              <ShoeCards shoeData={shoeData} isPersonal={false} />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomePage;
