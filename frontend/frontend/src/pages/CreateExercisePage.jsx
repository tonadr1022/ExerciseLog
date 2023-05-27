import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useForm } from "react-hook-form";

const CreateExercisePage = () => {
  const { register, handleSubmit } = useForm();

  // const handleSubmit = (event) => {
  //   console.log(event);
  // };

  return (
    <Container component="main">
      <Box
        sx={{
          border: "1px solid black",
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
          <DirectionsRunIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Add Exercise
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) => {
            alert(JSON.stringify(data));
          })}
          sx={{
            border: "1px solid black",
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "75%",
          }}>
          <TextField
            margin="normal"
            fullWidth
            {...register("name", { required: true, maxLength: 30 })}
            label="Name"
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            {...register("act_type", { required: true, maxLength: 30 })}
            label="Name"
            autoFocus
          />

          {/* <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age">
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Add
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateExercisePage;

const AddArticlePage = () => {
  // const { handleSubmit, control } = useForm();
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch("/api/create-article/", requestOptions);
    const jsonData = await response.json();
    console.log(jsonData);
  };
  const AddArticlePage = () => {
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h1" component="h1">
              Add Article
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                  <TextField
                    {...register("site", { required: true, maxLength: 20 })}
                    type="text"
                    label="Helper text"
                    defaultValue={"cnn_news"}
                  />
                </Grid>
                <Grid item xs={12} align="center">
                  <TextField
                    {...register("title", { required: true, maxLength: 20 })}
                    required={true}
                    type="text"
                    label="Helper text"
                    defaultValue={"title1"}
                  />
                </Grid>
                <Grid item xs={12} align="center">
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              color="secondary"
              variant="contained"
              to="/"
              component={Link}>
              Add Article
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              color="secondary"
              variant="contained"
              to="/"
              component={Link}>
              Back
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };
};
