/* eslint-disable react/prop-types */
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControlLabel, Checkbox } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import utc from "dayjs/plugin/utc";
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Modal } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExercise } from "../../api/exercisesApi";
import { unformatPace } from "../../utils/FormatContent";

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditExerciseModal = ({ open, toggle, exerciseToEdit, shoeData }) => {
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);
  const { register, handleSubmit, control } = useForm();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const updateExerciseMutation = useMutation(updateExercise, {
    onSuccess: () => {
      // invalidates cache and triggers refetch
      queryClient.invalidateQueries("exercises");
      queryClient.invalidateQueries("all_exercises");
    },
  });
  console.log(exerciseToEdit.shoe, exerciseToEdit.rating);
  const onSubmit = async (data) => {
    const date = dayjs(data.date_started);
    const time = dayjs(data.time_started);
    const datetime = date.format("YYYY-MM-DD[T]") + time.format("HH:mm");
    delete data.date_started;
    delete data.time_started;
    data.pace = unformatPace(data.pace);
    data["datetime_started"] = datetime;
    data["user"] = user.user_id;
    const editExerciseVariables = { exercise: data, id: exerciseToEdit.id };
    updateExerciseMutation.mutate(editExerciseVariables);
    toggle();
  };

  return (
    <Modal open={open} onClose={toggle}>
      <Box sx={style}>
        <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
          <DirectionsRunIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Edit Exercise
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
                defaultValue={exerciseToEdit.name}
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
                defaultValue={exerciseToEdit.act_type}
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
                defaultValue={exerciseToEdit.workout_type}
                {...register("workout_type", { required: true })}>
                <MenuItem value={"Standard"}>Standard</MenuItem>
                <MenuItem value={"Workout"}>Workout</MenuItem>
                <MenuItem value={"Long"}>Long</MenuItem>
              </Select>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="date_started"
                  control={control}
                  defaultValue={dayjs(exerciseToEdit.formatted_date)}
                  render={({ field }) => <DatePicker {...field} label="Date" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="time_started"
                  control={control}
                  defaultValue={dayjs(exerciseToEdit.formatted_time, "h:mm A")}
                  render={({ field }) => <TimePicker {...field} label="Time" />}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                required
                margin="normal"
                defaultValue={exerciseToEdit.duration}
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
                defaultValue={exerciseToEdit.distance}
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
                defaultValue={exerciseToEdit.pace}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                {...register("notes", { maxLength: 30 })}
                label="Notes"
                defaultValue={exerciseToEdit.notes}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                defaultValue={exerciseToEdit.log_notes}
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
                defaultValue={exerciseToEdit.rating || 8}
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
                defaultValue={exerciseToEdit.location}
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
                defaultValue={exerciseToEdit.shoe || ""}
                {...register("shoe")}>
                {shoeData.map((shoe) => (
                  <MenuItem key={shoe.id} value={shoe.nickname}>
                    {shoe.nickname}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("is_public")}
                    defaultChecked={exerciseToEdit.is_public}
                  />
                }
                label="Public"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "20%" }}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};
export default EditExerciseModal;
