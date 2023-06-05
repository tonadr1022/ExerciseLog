import ShoeCard from "../components/display/ShoeCard";
import { Button, Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUserShoes, deleteShoe } from "../api/shoesApi";
import useToggle from "../hooks/useToggle";
import DeleteModal from "../components/display/DeleteModal";
import { useState } from "react";
import EditShoeModal from "../components/display/EditShoeModal";
import ShoeCards from "../components/display/ShoeCards";

const UserShoesPage = () => {
  const [deleteModalOpen, deleteModalToggle] = useToggle();
  const [shoeToDelete, setShoeToDelete] = useState(null);
  const [editModalOpen, editModalToggle] = useToggle();
  const [shoeToEdit, setShoeToEdit] = useState(null);

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error,
    data: shoeData,
  } = useQuery(["shoes"], getUserShoes, {
    staleTime: 60 * 1000,
  });
  console.log("shoe data", shoeData);
  const deleteShoeMutation = useMutation(deleteShoe, {
    onSuccess: () => {
      queryClient.invalidateQueries("all_shoes");
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

  const editShoe = (shoe) => {
    setShoeToEdit(shoe);
    editModalToggle();
  };
  return (
    <Box
      sx={{
        marginTop: 3,
        marginBottom: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Button
        component={Link}
        color="secondary"
        to="/create-shoe"
        variant="contained"
        sx={{
          p: 1,
          width: "80%",
          textTransform: "none",
        }}>
        <Typography variant="h4">Add Shoe</Typography>
      </Button>
      {!isLoading && !isError ? (
        <>
          <ShoeCards
            editShoe={editShoe}
            handleDeleteToggle={handleDeleteToggle}
            shoeData={shoeData}
            isPersonal={true}
          />
          {editModalOpen && (
            <EditShoeModal
              open={editModalOpen}
              toggle={editModalToggle}
              shoeToEdit={shoeToEdit}
            />
          )}
          {deleteModalOpen && (
            <DeleteModal
              open={deleteModalOpen}
              toggle={deleteModalToggle}
              handleConfirm={handleDeleteConfirm}
              itemType="shoe"
            />
          )}
        </>
      ) : null}
    </Box>
  );
};

export default UserShoesPage;
