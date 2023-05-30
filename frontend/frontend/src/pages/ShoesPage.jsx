import ShoeCard from "../components/display/ShoeCard";
import { Button, Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getShoes, deleteShoe } from "../api/shoesApi";
import useToggle from "../hooks/useToggle";
import DeleteModal from "../components/display/DeleteModal";
import { useState } from "react";

const ShoesPage = () => {
  const [deleteModalOpen, deleteModalToggle] = useToggle();
  const [shoeToDelete, setShoeToDelete] = useState(null);

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error,
    data: shoeData,
  } = useQuery(["shoes"], getShoes, {
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * (60 * 1000),
  });

  const deleteShoeMutation = useMutation(deleteShoe, {
    onSuccess: () => {
      queryClient.invalidateQueries("shoes");
    },
  });

  const handleDeleteConfirm = async () => {
    deleteShoeMutation.mutate(shoeToDelete);
    deleteModalToggle();
  };

  const handleDeleteToggle = (id) => {
    setShoeToDelete(id);
    deleteModalToggle();
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
      {!isLoading ? (
        <>
          <Grid container spacing={4} sx={{ p: 4 }}>
            {shoeData.map((shoe) => (
              <Grid item key={shoe.id} xs={12} sm={6} md={4} lg={3}>
                <ShoeCard handleDeleteToggle={handleDeleteToggle} shoe={shoe} />
              </Grid>
            ))}
          </Grid>
          <DeleteModal
            open={deleteModalOpen}
            toggle={deleteModalToggle}
            handleConfirm={handleDeleteConfirm}
            itemType="shoe"
          />
        </>
      ) : null}
    </Box>
  );
};

export default ShoesPage;
