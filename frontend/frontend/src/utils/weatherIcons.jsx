import React from "react";
import { Cloud, Dehaze, WbSunny } from "@mui/icons-material";
import { Typography } from "@mui/material";

const weatherIcons = (type) => {
  console.log(type);
  return type === "Clouds" ? (
    <Cloud />
  ) : type === "Haze" ? (
    <Dehaze />
  ) : type === "Clear" ? (
    <WbSunny />
  ) : (
    <Typography>{type}</Typography>
  );
};

export default weatherIcons;
