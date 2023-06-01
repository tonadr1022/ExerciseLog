/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
const style = {
  borderColor: (theme) => theme.palette.secondary.main,
  borderWidth: "2px",
  borderStyle: "solid",
  "&:hover": {
    borderWidth: "2px",
  },
};
const ViewToggle = ({ handleChange, view, firstOption, secondOption }) => {
  return (
    <ToggleButtonGroup
      color="secondary"
      value={view}
      exclusive
      fullWidth
      onChange={handleChange}>
      <ToggleButton sx={style} value={firstOption}>
        {firstOption}
      </ToggleButton>
      <ToggleButton sx={style} value={secondOption}>
        {secondOption}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewToggle;
