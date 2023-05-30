import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useForm, Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import utc from "dayjs/plugin/utc";
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// import ShoeContext from "../context/ShoeContext";
// import { Link } from "react-router-dom";
import { AddCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { addExercise } from "../api/exercisesApi";
import { getShoes } from "../api/shoesApi";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

const CreateExercisePage = () => {
  dayjs.extend(utc);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // const { shoeData } = useContext(ShoeContext);
  const { register, handleSubmit, control } = useForm();
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError: shoesIsError,
    error: shoesError,
    data: shoeData,
  } = useQuery(["shoes"], getShoes, {
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * (60 * 1000),
  });

  const onSuccess = () => {
    // invalidates cache and triggers refetch
    queryClient.invalidateQueries("exercises");
    navigate("/");
  };

  const onError = (error) => {
    console.log("side effect error", error);
  };

  const {
    mutate: postExercise,
    isError: exerciseIsError,
    error: exerciseError,
  } = useMutation(addExercise, {
    onSuccess,
    onError,
  });

  const onSubmit = async (data) => {
    const a1 = dayjs(data.date_started);
    const a2 = dayjs(data.time_started);
    const date = a1.utc().format("YYYY-MM-DD[T]") + a2.utc().format("HH:mm[Z]");

    delete data.date_started;
    delete data.time_started;
    if (data.pace === "") delete data.pace;
    if (data.shoe === "") delete data.shoe;

    data["datetime_started"] = date;
    data["user"] = user.user_id;

    postExercise(data);
  };

  if (!(shoeData && shoeData.length)) {
    return (
      <>
        <Typography
          variant="h4"
          component="h4"
          sx={{ mt: 30, mb: 30, alignSelf: "center" }}>
          Please Save a Shoe First
        </Typography>
        <Button
          component={Link}
          to="/shoes/create"
          sx={{ mb: 30, width: "30%", alignSelf: "center" }}
          variant="contained"
          color="secondary"
          startIcon={<AddCircle />}>
          Create Shoe
        </Button>
      </>
    );
  }
  return (
    <>
      <Box
        sx={{
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "75%",
          }}>
          <Grid
            container
            direction={"row"}
            spacing={1}
            justifyContent={"center"}
            textAlign={"center"}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                required
                {...register("name", { required: true, maxLength: 30 })}
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                sx={{ mb: 2, width: "100%" }}
                required
                defaultValue={"Run"}
                {...register("act_type", { required: true })}>
                <MenuItem value={"Run"}>Run</MenuItem>
                <MenuItem value={"Bike"}>Bike</MenuItem>
                <MenuItem value={"Swim"}>Swim</MenuItem>
                <MenuItem value={"Elliptical"}>Elliptical</MenuItem>
                <MenuItem value={"Walk"}>Walk</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="workout-type-label">Workout Type</InputLabel>
              <Select
                labelId="workout-type-label"
                sx={{ width: "100%" }}
                required
                defaultValue={"Standard"}
                {...register("workout_type", { required: true })}>
                <MenuItem value={"Standard"}>Standard</MenuItem>
                <MenuItem value={"Recovery"}>Recovery</MenuItem>
                <MenuItem value={"Speed"}>Speed</MenuItem>
                <MenuItem value={"Long"}>Long</MenuItem>
              </Select>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="date_started"
                  control={control}
                  defaultValue={dayjs()}
                  render={({ field }) => <DatePicker {...field} label="Date" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="time_started"
                  control={control}
                  defaultValue={dayjs()}
                  render={({ field }) => <TimePicker {...field} label="Time" />}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                required
                margin="normal"
                {...register("duration", {
                  required: true,
                })}
                label="Duration"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                required
                margin="normal"
                {...register("distance", {
                  valueAsNumber: true,
                  required: true,
                })}
                label="Distance"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                margin="normal"
                {...register("pace")}
                label="Pace"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                {...register("notes", { maxLength: 30 })}
                label="Notes"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                {...register("log_notes", { maxLength: 30 })}
                label="Log Notes"
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="rating-label">Rating</InputLabel>
              <Select
                labelId="rating-label"
                sx={{ width: "10%", minWidth: 75 }}
                required
                defaultValue={8}
                {...register("rating", { valueAsNumber: true })}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={1}>1</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                {...register("location", { maxLength: 30 })}
                label="Location"
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="shoe-label">Shoe</InputLabel>
              <Select
                labelId="shoe-label"
                sx={{ width: "50%" }}
                required
                defaultValue={shoeData[0].nickname}
                {...register("shoe")}>
                {shoeData.map((shoe) => (
                  <MenuItem key={shoe.id} value={shoe.nickname}>
                    {shoe.nickname}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "20%" }}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default CreateExercisePage;

// const AddArticlePage = () => {
//   // const { handleSubmit, control } = useForm();
//   const { register, handleSubmit } = useForm();
//   const onSubmit = async (data) => {
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     };
//     const response = await fetch("/api/create-article/", requestOptions);
//     const jsonData = await response.json();
//     console.log(jsonData);
//   };
