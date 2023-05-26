/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
function Loading({ contentType }) {
  return (
    <Typography variant="h3" align="center">
      Waiting for {contentType} to load...
    </Typography>
  );
}

export default Loading;
