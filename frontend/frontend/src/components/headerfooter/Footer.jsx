import { Typography, Paper, Container, Box } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Paper sx={{ paddingTop: "50px" }}>
        <Container>
          <Box>
            <Typography variant="h5">Footer</Typography>
          </Box>
        </Container>
      </Paper>
    </>
  );
};
export default Footer;
