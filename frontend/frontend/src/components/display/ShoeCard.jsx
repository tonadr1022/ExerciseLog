/* eslint-disable react/prop-types */
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axiosInstance from "../../axios";

const ShoeCard = ({ shoe, handleShoeDelete }) => {
  const [open, setOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      handleShoeDelete(shoe.id);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickDelete = () => {
    setOpen(true);
  };

  return (
    <Card sx={{}}>
      <CardMedia
        component="img"
        alt="shoe image"
        height="150"
        image={shoe.image_url}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {shoe.nickname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {shoe.notes}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {shoe.distance_run}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
        <Button onClick={handleClickDelete} size="small">
          Delete
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {"Are you sure you want to delete this shoe?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};

export default ShoeCard;
