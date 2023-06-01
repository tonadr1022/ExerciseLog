/* eslint-disable react/prop-types */
import { Grid } from "@mui/material";
import ShoeCard from "./ShoeCard";

const ShoeCards = ({ shoeData, editShoe, handleDeleteToggle, isPersonal }) => {
  return (
    <Grid container spacing={4} padding={4}>
      {shoeData.map((shoe) => (
        <Grid item key={shoe.id} xs={12} md={4} sm={6} lg={3}>
          <ShoeCard
            editShoe={editShoe}
            handleDeleteToggle={handleDeleteToggle}
            shoe={shoe}
            isPersonal={isPersonal}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ShoeCards;
