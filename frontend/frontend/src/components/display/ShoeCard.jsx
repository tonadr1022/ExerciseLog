/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const ShoeCard = ({ shoe, handleDeleteToggle }) => {
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
        <Button onClick={() => handleDeleteToggle(shoe.id)} size="small">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ShoeCard;
