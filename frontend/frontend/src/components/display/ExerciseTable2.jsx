/* eslint-disable react/prop-types */
import { useMemo } from "react";
import Loading from "../headerfooter/Loading";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Link,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";

const ExerciseTable2 = ({
  exerciseData,
  editExercise,
  handleExerciseDelete,
}) => {
  const [showWeatherColumns, setShowWeatherColumns] = useState(false);
  const tableColumns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "act_type", header: "Form" },
      { accessorKey: "workout_type", header: "Type" },
      { accessorKey: "formatted_date", header: "Date" },
      { accessorKey: "formatted_time", header: "Time" },
      { accessorKey: "duration", header: "Duration (min)" },
      { accessorKey: "distance", header: "Distance (mi)" },
      { accessorKey: "pace", header: "Pace (min/mi)" },
      { accessorKey: "rating", header: "Rating" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "shoe", header: "Shoe" },
    ],
    []
  );
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(event) => setShowWeatherColumns(event.target.checked)}
            />
          }
          label="Show Weather"
        />
        <TableContainer sx={{ mb: 40 }} component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  {tableColumns.map((column) => (
                    <TableCell key={column.accessorKey} align="center">
                      {column.header}
                    </TableCell>
                  ))}
                  {showWeatherColumns && (
                    <>
                      <TableCell align="center">Temp</TableCell>
                      <TableCell align="center">Feels Like</TableCell>
                      <TableCell align="center">Humidity</TableCell>
                      <TableCell align="center">Wind</TableCell>
                      <TableCell align="center">From Current</TableCell>
                      <TableCell align="center">Weather Type</TableCell>
                    </>
                  )}
                </>
              </TableRow>
            </TableHead>
            <TableBody>
              {exerciseData.pages.map((page, index) =>
                page.results.map((exercise) => (
                  <TableRow
                    key={exercise.id}
                    hover
                    style={{ cursor: "pointer" }}
                    onClick={() => console.log(exercise.name)}>
                    <>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => editExercise(exercise)}
                          size="small"
                          color="inherit">
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleExerciseDelete(exercise.id)}
                          size="small"
                          color="inherit">
                          <Delete />
                        </IconButton>
                      </TableCell>
                      {tableColumns.map((column) => (
                        <TableCell align="center" key={column.accessorKey}>
                          {exercise[column.accessorKey]}
                        </TableCell>
                      ))}
                      {showWeatherColumns && (
                        <>
                          <TableCell>{exercise.weather.temperature}</TableCell>
                          <TableCell>{exercise.weather.feels_like}</TableCell>
                          <TableCell>{exercise.weather.humidity}</TableCell>
                          <TableCell>{exercise.weather.wind_speed}</TableCell>
                          <TableCell>
                            {exercise.weather.from_current_api
                              ? "true"
                              : "false"}
                          </TableCell>
                          <TableCell>{exercise.weather.type}</TableCell>
                        </>
                      )}
                    </>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ExerciseTable2;
