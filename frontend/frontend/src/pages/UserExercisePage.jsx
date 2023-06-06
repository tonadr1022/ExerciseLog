import ViewToggle from "../components/display/ViewToggle";
import { useState } from "react";
import ExerciseCards from "../components/display/ExerciseCards";
import { Button, Typography, Box, Grid } from "@mui/material";
import { RunCircle, AddCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ExerciseTable2 from "../components/display/ExerciseTable2";
import ExerciseTable3 from "../components/display/ExerciseTable3";
import EditExerciseModal from "../components/display/EditExerciseModal";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getUserExercises,
  updateExercise,
  deleteExercise,
  getTableExercises,
} from "../api/exercisesApi";
import DeleteModal from "../components/display/DeleteModal";
import useToggle from "../hooks/useToggle";
import { getUserShoes } from "../api/shoesApi";
import ExerciseDetailModal from "../components/display/ExerciseDetailModal";

export const UserExercisePage = () => {
  const [deleteModalOpen, deleteModalToggle] = useToggle();
  const [editModalOpen, editModalToggle] = useToggle();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [exerciseView, setExerciseView] = useState("Card");
  const [exercise, setExercise] = useState(null);

  const queryClient = useQueryClient();
  const { data: tableData } = useQuery(["table-exercises"], getTableExercises, {
    staleTime: 60 * 1000,
  });

  const {
    data: exerciseData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(["exercises"], getUserExercises, {
    getNextPageParam: (lastPage) => {
      return lastPage?.next.slice(-1);
    },
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
      queryClient.invalidateQueries("exercises");
      queryClient.invalidateQueries("all_exercises");
    },
  });

  const handleExerciseDelete = (id) => {
    setExercise(id);
    deleteModalToggle();
  };

  const handleDeleteConfirm = async () => {
    deleteExerciseMutation.mutate(exercise);
    deleteModalToggle();
  };

  const handleExerciseViewChange = (event, newView) => {
    if (newView) {
      setExerciseView(newView);
    }
  };

  const handleDetailClick = (exercise) => {
    setExercise(exercise);
    setDetailModalOpen(!detailModalOpen);
  };

  const editExercise = (exercise) => {
    setExercise(exercise);
    editModalToggle();
  };

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {!shoeIsLoading && !shoeIsError && (
        <>
          {exerciseData.length === 0 ? (
            <Grid
              container
              spacing={2}
              padding={2}
              sx={{ textAlign: "center" }}>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  to="/create-exercise"
                  sx={{ width: "80%" }}
                  variant="contained"
                  color="secondary"
                  startIcon={<RunCircle />}>
                  Create Exercise
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  to="/create-shoe"
                  sx={{ width: "80%" }}
                  variant="contained"
                  color="secondary"
                  startIcon={<AddCircle />}>
                  Create Shoe
                </Button>
              </Grid>
            </Grid>
          ) : (
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
                    to="/create-exercise"
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
                <Grid item xs={12} sx={{ padding: 4 }}>
                  {exerciseView === "Table"
                    ? tableData && (
                        // <ExerciseTable2
                        //   editExercise={editExercise}
                        //   tableData={tableData}
                        //   handleExerciseDelete={handleExerciseDelete}
                        // />
                        <ExerciseTable3 tableData={tableData.slice(0, 10)} />
                      )
                    : exerciseData.pages.map((page, index) => (
                        <ExerciseCards
                          key={index}
                          exerciseData={page.results}
                          isPersonal={true}
                          editExercise={editExercise}
                          handleExerciseDelete={handleExerciseDelete}
                          onDetailViewClick={handleDetailClick}
                        />
                      ))}
                </Grid>
                {exerciseView === "Card" && (
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      onClick={() => fetchNextPage()}
                      disabled={!hasNextPage || isFetchingNextPage}>
                      {isFetchingNextPage
                        ? "loading more..."
                        : hasNextPage
                        ? "Load More"
                        : "No More Content"}
                    </Button>
                  </Grid>
                )}
              </Grid>
              {editModalOpen && (
                <EditExerciseModal
                  open={editModalOpen}
                  toggle={editModalToggle}
                  shoeData={shoeData}
                  exercise={exercise}
                  updateExercise={updateExercise}
                />
              )}
              <DeleteModal
                open={deleteModalOpen}
                toggle={deleteModalToggle}
                handleConfirm={handleDeleteConfirm}
                itemType="exercise"
              />
              {exercise && (
                <ExerciseDetailModal
                  open={detailModalOpen}
                  toggle={() => setDetailModalOpen(!detailModalOpen)}
                  exercise={exercise}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserExercisePage;
