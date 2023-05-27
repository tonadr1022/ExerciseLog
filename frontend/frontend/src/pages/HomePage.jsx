import ExerciseTable from "../components/display/ExerciseTable";
import HomePageTopElements from "../components/display/HomePageTopElements";
// import TestGet from "../components/TestGet";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Button } from "@mui/material";
export const HomePage = () => {
  return (
    <>
      <HomePageTopElements></HomePageTopElements>
      {/* <TestGet /> */}
      <ExerciseTable />
    </>
  );
};

export default HomePage;
