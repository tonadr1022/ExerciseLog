import { Box, Typography } from "@mui/material";
const HomePageTopElements = () => {
  console.log("top rerendered");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        border: "2px solid red",
      }}>
      <Typography variant="h6">Home Page Elements Top</Typography>
    </Box>
  );
};

export default HomePageTopElements;
