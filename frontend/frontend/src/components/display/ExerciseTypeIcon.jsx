/* eslint-disable react/prop-types */
import { DirectionsBike, DirectionsRun } from "@mui/icons-material";

const ExerciseTypeIcon = ({ act_type, size, color }) => {
  return act_type === "Run" ? (
    <DirectionsRun color={color} fontSize={size} />
  ) : act_type === "Bike" ? (
    <DirectionsBike color={color} fontSize={size} />
  ) : null;
};

export default ExerciseTypeIcon;
