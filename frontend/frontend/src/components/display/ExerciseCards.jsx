/* eslint-disable react/prop-types */
import ExerciseCard from "./ExerciseCard";
import { Grid } from "@mui/material";

const ExerciseCards = ({
  exerciseData,
  editExercise,
  handleExerciseDelete,
  isPersonal,
  onDetailViewClick,
}) => {
  return (
    <>
      <Grid container padding={4} spacing={4}>
        {exerciseData.map((exercise, index) => (
          <Grid key={index} item xs={12} sm={6}>
            <ExerciseCard
              exercise={exercise}
              editExercise={editExercise}
              handleExerciseDelete={handleExerciseDelete}
              isPersonal={isPersonal}
              onDetailViewClick={onDetailViewClick}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default ExerciseCards;
