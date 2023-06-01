/* eslint-disable react/prop-types */
import ExerciseCard from "./ExerciseCard";
import { Grid } from "@mui/material";

const ExerciseCards = ({
  exerciseData,
  editExercise,
  handleExerciseDelete,
  isPersonal,
}) => {
  return (
    <>
      <Grid container padding={4} spacing={4}>
        {exerciseData.map((exercise, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <ExerciseCard
              exercise={exercise}
              editExercise={editExercise}
              handleExerciseDelete={handleExerciseDelete}
              isPersonal={isPersonal}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default ExerciseCards;
