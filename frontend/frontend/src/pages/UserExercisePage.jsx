import ViewToggle from "../components/display/ViewToggle";
import { useState, useRef } from "react";
import ExerciseCards from "../components/display/ExerciseCards";
import { Button, Typography, Box, Grid } from "@mui/material";
import { RunCircle, AddCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ExerciseTable2 from "../components/display/ExerciseTable2";
import EditExerciseModal from "../components/display/EditExerciseModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserExercises,
  updateExercise,
  deleteExercise,
} from "../api/exercisesApi";
import DeleteModal from "../components/display/DeleteModal";
import useToggle from "../hooks/useToggle";
import { getUserShoes } from "../api/shoesApi";

export const UserExercisePage = () => {
  const [deleteModalOpen, deleteModalToggle] = useToggle();
  const [editModalOpen, editModalToggle] = useToggle();
  const [exerciseView, setExerciseView] = useState("Card");
  const [exerciseToEdit, setExerciseToEdit] = useState(null);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error,
    data: exerciseData,
  } = useQuery(["exercises"], getUserExercises, {
    staleTime: 60 * 1000,
  });

  const {
    shoeIsLoading,
    shoeIsError,
    shoeError,
    data: shoeData,
  } = useQuery(["shoes"], getUserShoes, {
    staleTime: 60 * 1000,
  });

  const deleteExerciseMutation = useMutation(deleteExercise, {
    onSuccess: () => {
      // invalidates cache and triggers refetch
      queryClient.invalidateQueries("exercises");
      queryClient.invalidateQueries("all_exercises");
    },
  });

  const handleExerciseDelete = (id) => {
    setExerciseToDelete(id);
    // deleteModalToggle();
    deleteModalToggle();
  };

  const handleDeleteConfirm = async () => {
    deleteExerciseMutation.mutate(exerciseToDelete);
    // deleteModalToggle();
    deleteModalToggle();
  };

  const handleExerciseViewChange = (event, newView) => {
    if (newView.length) {
      setExerciseView(newView);
    }
  };

  const editExercise = (exercise) => {
    setExerciseToEdit(exercise);
    editModalToggle();
  };

  return (
    <>
      {!isLoading && !isError && exerciseData.length === 0 ? (
        <>
          <Button
            component={Link}
            to="/create-exercise"
            sx={{ m: 30, width: "30%", alignSelf: "center" }}
            variant="contained"
            color="secondary"
            startIcon={<RunCircle />}>
            Create Exercise
          </Button>
          <Button
            component={Link}
            to="/create-shoe"
            sx={{ mb: 30, width: "30%", alignSelf: "center" }}
            variant="contained"
            color="secondary"
            startIcon={<AddCircle />}>
            Create Shoe
          </Button>
        </>
      ) : (
        <>
          {!isLoading && !isError && !shoeIsLoading ? (
            <>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{
                    padding: 4,
                  }}>
                  <Button
                    component={Link}
                    color="secondary"
                    to="/create-shoe"
                    variant="contained"
                    fullWidth
                    sx={{
                      textTransform: "none",
                    }}>
                    <Typography variant="h4">Add Exercise</Typography>
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    pr: 4,
                    pl: 4,
                    pb: 2,
                  }}>
                  <ViewToggle
                    handleChange={handleExerciseViewChange}
                    view={exerciseView}
                    firstOption={"Card"}
                    secondOption={"Table"}
                  />
                </Grid>
                <Grid item xs={12}>
                  {exerciseView === "Table" ? (
                    <ExerciseTable2
                      editExercise={editExercise}
                      exerciseData={exerciseData}
                      handleExerciseDelete={handleExerciseDelete}
                    />
                  ) : (
                    <ExerciseCards
                      exerciseData={exerciseData}
                      isPersonal={true}
                      editExercise={editExercise}
                      handleExerciseDelete={handleExerciseDelete}
                    />
                  )}
                </Grid>
              </Grid>
              {editModalOpen && (
                <EditExerciseModal
                  open={editModalOpen}
                  toggle={editModalToggle}
                  shoeData={shoeData}
                  exerciseToEdit={exerciseToEdit}
                  updateExercise={updateExercise}
                />
              )}
              <DeleteModal
                open={deleteModalOpen}
                toggle={deleteModalToggle}
                handleConfirm={handleDeleteConfirm}
                itemType="exercise"
              />
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default UserExercisePage;
