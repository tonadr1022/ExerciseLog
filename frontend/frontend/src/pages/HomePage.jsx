import ExerciseTable from "../components/ExerciseTable";
import HomePageTopElements from "../components/HomePageTopElements";

export const HomePage = () => {
  console.log("home page rerender");
  return (
    <>
      <HomePageTopElements></HomePageTopElements>
      <ExerciseTable />
    </>
  );
};
export default HomePage;
