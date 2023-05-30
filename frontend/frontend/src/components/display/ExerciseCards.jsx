import React from "react";
import ExerciseCard from "./ExerciseCard";
import { Grid, Box } from "@mui/material";
import Loading from "../headerfooter/Loading";

const ExerciseCards = ({ exercises }) => {
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          {exercises.map((exercise, index) => (
            <Grid key={index} item xs={6}>
              <ExerciseCard exercise={exercise} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
export default ExerciseCards;
