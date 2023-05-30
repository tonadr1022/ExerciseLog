/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
const ExerciseCard = ({ exercise }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {exercise.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {exercise.notes}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Delete</Button>
      </CardActions>
    </Card>
  );
};
export default ExerciseCard;
