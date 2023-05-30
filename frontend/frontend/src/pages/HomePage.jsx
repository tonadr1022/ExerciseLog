import ExerciseViewToggle from "../components/display/ExerciseViewToggle";
import { useState } from "react";
import ExerciseCards from "../components/display/ExerciseCards";
import { Button } from "@mui/material";
import { RunCircle, AddCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ExerciseTable2 from "../components/display/ExerciseTable2";
import EditExerciseModal from "../components/display/EditExerciseModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExercises,
  updateExercise,
  deleteExercise,
} from "../api/exercisesApi";
import DeleteModal from "../components/display/DeleteModal";
import useToggle from "../hooks/useToggle";

export const HomePage = () => {
  const [deleteModalOpen, deleteModalToggle] = useToggle();
  const [editModalOpen, editModalToggle] = useToggle();
  const [exerciseView, setExerciseView] = useState("Table");
  const [exerciseToEdit, setExerciseToEdit] = useState(null);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error,
    data: exercises,
  } = useQuery(["exercises"], getExercises, {
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * (60 * 1000),
  });

  // const updateExerciseMutation = useMutation(updateExercise, {
  //   onSuccess: () => {
  //     // invalidates cache and triggers refetch
  //     queryClient.invalidateQueries("exercises");
  //   },
  // });

  const deleteExerciseMutation = useMutation(deleteExercise, {
    onSuccess: () => {
      // invalidates cache and triggers refetch
      queryClient.invalidateQueries("exercises");
    },
  });

  const handleExerciseDelete = async (id) => {
    setExerciseToDelete(id);
    deleteModalToggle();
  };

  const handleDeleteConfirm = async () => {
    deleteExerciseMutation.mutate(exerciseToDelete);
    deleteModalToggle();
  };

  const handleExerciseViewChange = (event, newView) => {
    setExerciseView(newView);
  };

  const editExercise = (id) => {
    setExerciseToEdit(exercises.filter((exercise) => exercise.id === id)[0]);
    editModalToggle();
  };

  const onClose = () => {
    editModalToggle();
  };

  return (
    <>
      {!isLoading && !isError && exercises.length === 0 ? (
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
      ) : (
        <>
          {!isLoading && !isError ? (
            <>
              <ExerciseViewToggle
                handleExerciseViewChange={handleExerciseViewChange}
                exerciseView={exerciseView}
              />
              {exerciseView === "Table" ? (
                <ExerciseTable2
                  editExercise={editExercise}
                  exercises={exercises}
                  handleExerciseDelete={handleExerciseDelete}
                />
              ) : (
                <ExerciseCards
                  exercises={exercises}
                  handleExerciseDelete={handleExerciseDelete}
                />
              )}
              {editModalOpen && (
                <EditExerciseModal
                  onClose={onClose}
                  exerciseToEdit={exerciseToEdit}
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

export default HomePage;
