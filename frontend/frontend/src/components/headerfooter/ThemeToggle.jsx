/* eslint-disable react/prop-types */
import React from "react";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { ColorModeContext } from "../../App";
import { Brightness4Rounded, Brightness7Rounded } from "@mui/icons-material";

function ThemeToggle() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const handleToggle = () => {
    colorMode.toggleColorMode();
  };
  return (
    <IconButton onClick={handleToggle} color="inherit">
      {theme.palette.mode === "light" ? (
        <Brightness7Rounded />
      ) : (
        <Brightness4Rounded />
      )}
    </IconButton>
  );
}

export default ThemeToggle;
