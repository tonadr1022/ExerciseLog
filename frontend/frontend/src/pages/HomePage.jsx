import ExerciseTable from "../components/display/ExerciseTable";
import ExerciseViewToggle from "../components/display/ExerciseViewToggle";
import { useState } from "react";
import ExerciseCards from "../components/display/ExerciseCards";
import useExerciseData from "../requests/useExerciseData";
import { Button } from "@mui/material";
import { RunCircle, AddCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ExerciseTable2 from "../components/display/ExerciseTable2";
import { useEffect } from "react";
import EditExerciseModal from "../components/display/EditExerciseModal";

export const HomePage = () => {
  const { exerciseData, loading, error } = useExerciseData();
  const [exerciseView, setExerciseView] = useState("Table");
  const [editExerciseData, setEditExerciseData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleExerciseViewChange = (event, newView) => {
    setExerciseView(newView);
  };

  const editExercise = (id) => {
    setEditExerciseData(
      exerciseData.filter((exercise) => exercise.id === id)[0]
    );
    setEditModalOpen(true);
  };

  const onClose = () => {
    setEditModalOpen(false);
  };
  // useEffect(() => {
  //   if (exerciseData && rowToEdit) {
  //     console.log(exerciseData.filter((exercise) => exercise.id === rowToEdit));
  //   }
  // }, [rowToEdit, exerciseData]);

  if (exerciseData.length === 0) {
    return (
      <>
        <Button
          component={Link}
          to="exercise/create"
          sx={{ m: 30, width: "30%", alignSelf: "center" }}
          variant="contained"
          color="secondary"
          startIcon={<RunCircle />}>
          Create Exercise
        </Button>
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
      <ExerciseViewToggle
        handleExerciseViewChange={handleExerciseViewChange}
        exerciseView={exerciseView}
      />
      {exerciseView === "Table" ? (
        // <ExerciseTable
        //   exerciseData={exerciseData}
        //   loading={loading}
        //   error={error}
        // />
        <ExerciseTable2
          editExercise={editExercise}
          exerciseData={exerciseData}
          loading={loading}
          error={error}
        />
      ) : (
        <ExerciseCards
          exerciseData={exerciseData}
          loading={loading}
          error={error}
        />
      )}
      {editModalOpen && (
        <EditExerciseModal
          onClose={onClose}
          editExerciseData={editExerciseData}
        />
      )}
    </>
  );
};

export default HomePage;
