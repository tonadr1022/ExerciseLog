/* eslint-disable react/prop-types */
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Image } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShoe } from "../../api/shoesApi";
import { DirectionsRun } from "@mui/icons-material";
import useFilePreview from "../../hooks/useFilePreview";

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditShoeModal = ({ open, toggle, shoeToEdit }) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const watchImageUrl = watch("image", false);
  const { imgSrc, setImgSrc } = useFilePreview(watchImageUrl);

  const handleImageReset = () => {
    reset({ image: "" });
    setImgSrc(null);
  };
  const editShoeMutation = useMutation(updateShoe, {
    onSuccess: () => {
      // invalidates cache and triggers refetch
      queryClient.invalidateQueries("all_shoes");
      queryClient.invalidateQueries("shoes");
      toggle();
    },
  });
  const onSubmit = async (data) => {
    data["user"] = user.user_id;
    const formData = new FormData();
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    } else {
      delete data.image;
    }
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key]);
      }
    }
    const editShoeVariables = { shoe: formData, id: shoeToEdit.id };
    editShoeMutation.mutate(editShoeVariables);
  };

  return (
    <Modal open={open} onClose={toggle}>
      <Box sx={style}>
        <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
          <DirectionsRun />
        </Avatar>
        <Typography component="h1" variant="h4">
          Edit Shoe
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "75%",
          }}>
          <Grid
            container
            direction={"row"}
            spacing={1}
            justifyContent={"center"}
            textAlign={"center"}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                defaultValue={shoeToEdit.nickname}
                {...register("nickname", { required: true, maxLength: 30 })}
                label="Nickname"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                required
                defaultValue={shoeToEdit.brand}
                {...register("brand", { required: true, maxLength: 30 })}
                label="Brand"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                required
                defaultValue={shoeToEdit.model}
                {...register("model", { required: true, maxLength: 30 })}
                label="Model"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                required
                defaultValue={shoeToEdit.notes}
                {...register("notes", { required: true })}
                label="Notes"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                required
                defaultValue={shoeToEdit.distance_run}
                {...register("distance_run", {
                  required: true,
                  valueAsNumber: true,
                })}
                label="Distance Run"
              />
            </Grid>
            <Grid item xs={12}>
              {imgSrc && imgSrc[0] !== null ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  <Button
                    variant="contained"
                    sx={{ mt: 3, mb: 3, width: "20%" }}
                    onClick={handleImageReset}>
                    Reset
                  </Button>
                  <img style={{ height: "auto", width: "50%" }} src={imgSrc} />
                </Box>
              ) : (
                <Button
                  startIcon={<Image />}
                  variant="contained"
                  component="label">
                  Image Upload
                  <input
                    type="file"
                    id="image"
                    hidden
                    accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"
                    {...register("image")}
                  />
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("is_public")}
                    defaultChecked={shoeToEdit.is_public}
                  />
                }
                label="Public"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 3, width: "20%" }}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditShoeModal;
