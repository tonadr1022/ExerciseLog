/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { getRatingColor } from "../../utils/colors";
import ExerciseTypeIcon from "./ExerciseTypeIcon";
import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";
import {
  MapContainer,
  Polyline,
  TileLayer,
  Popup,
  Marker,
} from "react-leaflet";
const ExerciseCard = ({
  exercise,
  editExercise,
  handleExerciseDelete,
  onDetailViewClick,
  isPersonal,
}) => {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (exercise?.map?.polyline) {
      setCoords(polyline.decode(exercise.map.polyline));
      // const summary_coords = polyline.decode(exercise.map.summary_polyline);
    } else if (exercise?.map?.summary_polyline) {
      setCoords(polyline.decode(exercise.map.summary_polyline));
    }
  }, [exercise.map]);
  // color gradient function adapted from Chat GPT
  const ratingColor = getRatingColor(exercise.rating);
  return (
    <Card elevation={10} sx={{ height: coords ? 600 : 600 }}>
      <CardContent
        style={{ cursor: "pointer" }}
        onClick={() => onDetailViewClick(exercise)}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <ExerciseTypeIcon
              act_type={exercise.act_type}
              size="large"
              color={"primary"}
            />
          </Grid>
          {!isPersonal && (
            <Grid item xs={8}>
              <Typography gutterBottom variant="h4">
                {exercise.name}
                {exercise.user.last_name}
              </Typography>
            </Grid>
          )}
          {isPersonal && (
            <Grid item xs={8}>
              <Typography align="center" variant="h4">
                {exercise.name}
              </Typography>
            </Grid>
          )}
          <Grid item xs={2}>
            <Typography align="right" variant="h4" sx={{ color: ratingColor }}>
              {exercise.rating}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="center" variant="h6">
              {exercise.formatted_date}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography align="center" variant="h6">
              {exercise.formatted_time}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" color="text.primary">
              {exercise.workout_type} | {exercise.distance}mi |{" "}
              {exercise.duration} | {exercise.pace}/mi
            </Typography>
          </Grid>
          {exercise.location && (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="text.primary">
                {exercise.location}
              </Typography>
            </Grid>
          )}
          {exercise.total_elevation_gain && (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="text.primary">
                Elevation Gain: {exercise.total_elevation_gain}ft
              </Typography>
            </Grid>
          )}
          {exercise.weather && (
            <Grid item xs={12}>
              <Typography
                gutterBottom
                variant="h6"
                align="center"
                color="text.primary">
                {exercise.weather.temperature
                  ? `Temp ${exercise.weather.temperature}`
                  : null}
                {exercise.weather.humidity
                  ? ` | Humidity ${exercise.weather.humidity}`
                  : null}
                {exercise.weather.feels_like
                  ? ` | Feels Like ${exercise.weather.feels_like}`
                  : null}
                {exercise.weather.type ? ` | ${exercise.weather.type}` : null}
                {exercise.weather.wind_speed
                  ? ` | ${exercise.weather.wind_speed}`
                  : null}
                {exercise.weather.from_current_api ? " | Needs Update" : null}
              </Typography>
            </Grid>
          )}
          {exercise.notes && (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="text.secondary">
                {exercise.notes}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="text.secondary">
              {exercise.shoe ? exercise.shoe : "Needs Shoe"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      {isPersonal && (
        <>
          <Grid container>
            <Grid item xs={6}>
              <Button
                size="large"
                fullWidth
                onClick={() => editExercise(exercise)}>
                Edit
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                size="large"
                fullWidth
                onClick={() => handleExerciseDelete(exercise.id)}>
                Delete
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      {coords ? (
        <MapContainer
          style={{ marginTop: 10, height: "80%", width: "100%" }}
          center={coords[0]}
          zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords[0]}>
            <Popup>{exercise?.name}</Popup>
          </Marker>
          <Polyline color="blue" positions={coords}></Polyline>
        </MapContainer>
      ) : (
        <Typography variant="h6">No Map</Typography>
      )}
    </Card>
  );
};
export default ExerciseCard;
