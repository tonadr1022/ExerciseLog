/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";
import { Modal, Box, Typography } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import weatherIcons from "../../utils/weatherIcons";

// const style = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
//   outline: "none",
//   width: "90%",
//   height: "90%",
// };
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
  outline: "none",
};

const ExerciseDetailModal = ({ exercise, open, toggle }) => {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (exercise?.map?.polyline) {
      setCoords(polyline.decode(exercise.map.polyline));
      // const summary_coords = polyline.decode(exercise.map.summary_polyline);
    }
  }, [exercise.map]);
  return (
    <Modal open={open} onClose={toggle}>
      <Box
        // className="leaflet-container"
        sx={[style, { height: coords ? "90%" : "40%" }]}>
        <Typography variant="h2">{exercise?.name}</Typography>
        <Typography variant="h5">
          {exercise?.distance}/mi | {exercise?.duration}/mi | {exercise?.pace}
        </Typography>
        <Typography align="center" variant="h6">
          {`${exercise?.formatted_date} ${exercise?.formatted_time}`}
        </Typography>
        <Typography
          gutterBottom
          variant="h6"
          align="center"
          color="text.primary">
          {exercise.weather?.temperature
            ? `Temp ${exercise.weather.temperature}`
            : null}
          {exercise.weather?.humidity
            ? ` | Humidity ${exercise.weather.humidity}`
            : null}
          {exercise.weather?.feels_like
            ? ` | Feels Like ${exercise.weather.feels_like}`
            : null}

          {exercise.weather?.wind_speed
            ? ` | ${exercise.weather.wind_speed}mph`
            : null}
          {exercise.weather?.from_current_api ? " | Needs Update" : null}
        </Typography>
        {exercise.weather?.type && weatherIcons(exercise.weather.type)}
        {exercise.notes && (
          <Typography variant="body1" align="center" color="text.secondary">
            {exercise.notes}
          </Typography>
        )}
        <Typography variant="body1" align="center" color="text.secondary">
          {exercise.shoe ? exercise.shoe : "Needs Shoe!"}
        </Typography>
        {coords ? (
          <MapContainer
            style={{ marginTop: 10, height: "100%", width: "100%" }}
            center={coords[0]}
            zoom={14}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords[0]}>
              <Popup>{exercise?.name}</Popup>
            </Marker>
            <Polyline color="blue" positions={coords}></Polyline>
          </MapContainer>
        ) : null}
      </Box>
    </Modal>
  );
};

export default ExerciseDetailModal;
