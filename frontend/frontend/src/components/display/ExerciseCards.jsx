import React from "react";
import ExerciseCard from "./ExerciseCard";
import { Grid, Box } from "@mui/material";
import Loading from "../headerfooter/Loading";

const ExerciseCards = ({ exerciseData, loading, error }) => {
  console.log(exerciseData);
  return (
    <>
      <Box>
        {loading ? (
          <Loading contentType={"Exercises"} />
        ) : error ? (
          <div>
            <Loading contentType={"Exercises"} />
            Error: {error.message}
          </div>
        ) : (
          <Grid container spacing={2}>
            {exerciseData.map((exercise, index) => (
              <Grid key={index} item xs={6}>
                <ExerciseCard exercise={exercise} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};
export default ExerciseCards;
