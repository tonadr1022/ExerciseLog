/* eslint-disable react/prop-types */
// import React from "react";
import { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import useExerciseData from "../../requests/useExerciseData";
import { Box } from "@mui/material";
import Loading from "../headerfooter/Loading";

const ExerciseTable = () => {
  const tableColumns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "act_type", header: "Form", minSize: 10 },
      { accessorKey: "workout_type", header: "Type", size: 5, minSize: 75 },
      { accessorKey: "formatted_date", header: "Date", minSize: 60 },
      { accessorKey: "formatted_time", header: "Time", minSize: 40 },
      { accessorKey: "duration", header: "Duration (min)" },
      { accessorKey: "distance", header: "Distance (mi)" },
      { accessorKey: "pace", header: "Pace (min/mi)" },
      { accessorKey: "rating", header: "Rating" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "shoe", header: "Shoe" },
    ],
    []
  );

  const { exerciseData, loading, error } = useExerciseData();
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    console.log(row, values);
    // exerciseData[row.index] = values;
    exitEditingMode();
  };

  return (
    <Box sx={{}}>
      {loading ? (
        <Loading contentType={"Exercises"} />
      ) : error ? (
        <div>
          <Loading contentType={"Exercises"} />
          Error: {error.message}
        </div>
      ) : (
        <MaterialReactTable
          columns={tableColumns}
          data={exerciseData}
          enableEditing
          editingMode="modal"
          onEditingRowSave={handleSaveRow}
          defaultColumn={{ minSize: 10, maxSize: 100 }}
        />
      )}
    </Box>
  );
};
export default ExerciseTable;
