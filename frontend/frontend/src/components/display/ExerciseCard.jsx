/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import { getRatingColor } from "../../utils/colors";
import ExerciseTypeIcon from "./ExerciseTypeIcon";
const ExerciseCard = ({
  exercise,
  editExercise,
  handleExerciseDelete,
  isPersonal,
}) => {
  // color gradient function adapted from Chat GPT
  const ratingColor = getRatingColor(exercise.rating);

  return (
    <Card elevation={10}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <ExerciseTypeIcon
              act_type={exercise.act_type}
              size="large"
              color={"primary"}
            />
          </Grid>
          {!isPersonal && (
            <Grid item xs={8}>
              <Typography gutterBottom variant="h4" component="div">
                {exercise.user.first_name}
                {exercise.user.last_name}
              </Typography>
            </Grid>
          )}
          {isPersonal && (
            <Grid item xs={8}>
              <Typography align="center" variant="h4" component="div">
                {exercise.name}
              </Typography>
            </Grid>
          )}
          <Grid item xs={2}>
            <Typography align="right" variant="h4" sx={{ color: ratingColor }}>
              {exercise.rating}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="center" gutterBottom variant="h6">
              {exercise.formatted_date}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="center" gutterBottom variant="h6">
              {exercise.formatted_time}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" color="text.primary">
              {exercise.workout_type} | {exercise.distance}mi |{" "}
              {exercise.duration} | {exercise.pace}/mi
            </Typography>
          </Grid>{" "}
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="text.primary">
              {exercise.location}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              gutterBottom
              variant="h6"
              align="center"
              color="text.primary">
              Temp {exercise.weather.temperature} | Humidity{" "}
              {exercise.weather.humidity} | Feels Like{" "}
              {exercise.weather.feels_like}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {exercise.notes && (
              <Typography variant="body1" align="center" color="text.secondary">
                {exercise.notes}
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
      {isPersonal && (
        <>
          <Grid container>
            <Grid item xs={6}>
              <Button
                size="large"
                fullWidth
                onClick={() => editExercise(exercise)}>
                Edit
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                size="large"
                fullWidth
                onClick={() => handleExerciseDelete(exercise.id)}>
                Delete
              </Button>
            </Grid>
          </Grid>
        </>
      )}{" "}
    </Card>
  );
};
export default ExerciseCard;
