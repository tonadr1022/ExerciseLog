/* eslint-disable react/prop-types */
import ExerciseCard from "./ExerciseCard";
import { Grid, Box } from "@mui/material";

const ExerciseCards = ({ exercises, editExercise, handleExerciseDelete }) => {
  return (
    <>
      <Grid justifyContent="center" container spacing={2}>
        {exercises.map((exercise, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={6}
            md={4}
            paddingRight={2}
            paddingBottom={2}>
            <ExerciseCard
              exercise={exercise}
              editExercise={editExercise}
              handleExerciseDelete={handleExerciseDelete}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default ExerciseCards;
