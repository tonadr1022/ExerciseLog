import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getAllExercises } from "../api/exercisesApi";
import { useState } from "react";
import ExerciseCards from "../components/display/ExerciseCards";
import ViewToggle from "../components/display/ViewToggle";
import ShoeCards from "../components/display/ShoeCards";
import { getAllShoes } from "../api/shoesApi";
import { Grid, Button, Typography } from "@mui/material/";
import ExerciseDetailModal from "../components/display/ExerciseDetailModal";

const HomePage = () => {
  const [view, setView] = useState("Exercises");
  const [exercise, setExercise] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // const {
  //   data: exerciseData,
  //   isLoading: exercisesIsLoading,
  //   isError: exercisesIsError,
  //   error: exercisesError,
  // } = useQuery(["all_exercises"], getAllExercises, {
  //   staleTime: 60 * 1000,
  // });

  const {
    data: shoeData,
    isLoading: shoesIsLoading,
    isError: shoesIsError,
    error: shoesError,
  } = useQuery(["all_shoes"], getAllShoes, {
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
  } = useInfiniteQuery(["all_exercises"], getAllExercises, {
    getNextPageParam: (lastPage) => {
      return lastPage?.next.slice(-1);
    },
    staleTime: 60 * 1000,
  });

  const handleDetailClick = (exercise) => {
    setExercise(exercise);
    setDetailModalOpen(!detailModalOpen);
  };

  const handleViewChange = (event, newView) => {
    if (newView) {
      setView(newView);
    }
  };
  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {shoesIsLoading ? null : shoesIsError ? (
        <div>
          <span>{shoesError.message}</span>
        </div>
      ) : (
        <>
          <Grid container padding={2} spacing={2}>
            <Grid item xs={12}>
              <ViewToggle
                handleChange={handleViewChange}
                view={view}
                firstOption={"Exercises"}
                secondOption={"Shoes"}
              />
            </Grid>
            <Grid item xs={12}>
              {view === "Exercises" ? (
                exerciseData?.pages.map((page, index) => (
                  <ExerciseCards
                    key={index}
                    isPersonal={false}
                    exerciseData={page.results}
                    onDetailViewClick={handleDetailClick}
                  />
                ))
              ) : (
                <ShoeCards shoeData={shoeData} isPersonal={false} />
              )}
            </Grid>
            {view === "Exercises" ? (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ height: 100, marginTop: 4, marginBottom: 32 }}
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}>
                  <Typography variant="h4" textTransform={"none"}>
                    {isFetchingNextPage
                      ? "Loading More..."
                      : hasNextPage
                      ? "Load More"
                      : "nothing more"}
                  </Typography>
                </Button>
              </Grid>
            ) : null}
          </Grid>
          <Typography variant="h6">
            {isFetching && !isFetchingNextPage ? "Fetching..." : null}
          </Typography>
        </>
      )}
      {exercise && (
        <ExerciseDetailModal
          open={detailModalOpen}
          toggle={() => setDetailModalOpen(!detailModalOpen)}
          exercise={exercise}
        />
      )}
    </>
  );
};

export default HomePage;
