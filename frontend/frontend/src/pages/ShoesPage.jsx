import { useContext } from "react";
import ShoeCard from "../components/display/ShoeCard";
import { Button, Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import ShoeContext from "../context/ShoeContext";
import axiosInstance from "../axios";

const ShoesPage = () => {
  const { shoeData, setShoeData } = useContext(ShoeContext);
  const handleShoeDelete = async (id) => {
    try {
      console.log(id);
      const response = await axiosInstance.delete(`shoes/${id}/`);
      console.log(response);
      setShoeData((prevShoeData) => {
        const newShoeData = prevShoeData.filter((shoe) => shoe.id !== id);
        return newShoeData;
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Button
        component={Link}
        to="/shoes/create"
        variant="contained"
        sx={{ p: 1, width: "10%", minWidth: 120 }}>
        Add Shoe
      </Button>
      <Grid container spacing={4} sx={{ p: 4 }}>
        {shoeData.map((shoe) => (
          <Grid item key={shoe.id} xs={12} sm={6} md={4} lg={3}>
            <ShoeCard handleShoeDelete={handleShoeDelete} shoe={shoe} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShoesPage;
