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

const ExerciseTable2 = ({ exercises, editExercise, handleExerciseDelete }) => {
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
                    </>
                  )}
                </>
              </TableRow>
            </TableHead>
            <TableBody>
              {exercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <>
                    <TableCell align="center" width={0}>
                      <IconButton
                        onClick={() => editExercise(exercise.id)}
                        size="small"
                        color="inherit">
                        <Edit />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center" width={0}>
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
                        <TableCell>{exercise.temperature}</TableCell>
                        <TableCell>{exercise.feels_like}</TableCell>
                        <TableCell>{exercise.humidity}</TableCell>
                      </>
                    )}
                  </>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ExerciseTable2;
