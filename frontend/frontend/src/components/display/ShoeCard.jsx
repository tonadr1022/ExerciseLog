/* eslint-disable react/prop-types */
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import placeholderImage from "../../assets/shoe_paceholder.jpg";

const ShoeCard = ({ shoe, editShoe, handleDeleteToggle, isPersonal }) => {
  const image = shoe.image ? shoe.image : placeholderImage;
  return (
    <Card elevation={10}>
      <CardMedia component="img" alt="shoe image" image={image} />
      <CardContent>
        {isPersonal && (
          <Typography align="center" variant="h5" component="h5">
            {shoe.nickname}
          </Typography>
        )}
        <Typography align="center" variant="h5" component="h5">
          {shoe.brand} {shoe.model}
        </Typography>{" "}
        {!isPersonal && (
          <Typography align="center" variant="h6">
            {shoe.user.first_name} {shoe.user.last_name}
          </Typography>
        )}
        <Typography align="center" variant="body1">
          Distance: {shoe.distance_run}mi
        </Typography>
        <Typography align="center" variant="body2" color="text.secondary">
          {shoe.notes}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: 0 }}>
        <Grid
          container
          padding={0}
          sx={{
            textAlign: "center",
          }}
          alignItems={"center"}
          justifyContent={"center"}>
          {isPersonal && (
            <>
              <Grid item xs={6}>
                <Button size="large" fullWidth onClick={() => editShoe(shoe)}>
                  Edit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="large"
                  fullWidth
                  onClick={() => handleDeleteToggle(shoe.id)}>
                  Delete
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ShoeCard;
