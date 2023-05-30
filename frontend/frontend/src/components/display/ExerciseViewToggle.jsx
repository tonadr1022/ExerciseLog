/* eslint-disable react/prop-types */
import { Box, Button, ButtonGroup } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const ExerciseViewToggle = ({ handleExerciseViewChange, exerciseView }) => {
  return (
    <Box
      sx={{
        margin: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}>
      <ToggleButtonGroup
        color="primary"
        value={exerciseView}
        exclusive
        onChange={handleExerciseViewChange}>
        <ToggleButton value="Table">Table</ToggleButton>
        <ToggleButton value="Card">Card</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ExerciseViewToggle;
