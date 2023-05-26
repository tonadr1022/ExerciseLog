/* eslint-disable react/prop-types */
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

const Header = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Tooltip title="Home">
              <IconButton
                to="/"
                component={Link}
                size="large"
                edge="start"
                color="inherit">
                <DirectionsRunIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h5"
              component="div"
              noWrap
              sx={{ marginRight: 4 }}>
              Exercise Log
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <Button to="/shoes" component={Link} color="inherit">
                Shoes
              </Button>

              <Button color="inherit">Logout</Button>
            </Stack>
            <Button to="/login" component={Link} color="inherit">
              Login
            </Button>
            <Button to="/register" component={Link} color="inherit">
              Register
            </Button>
            <Button to="/logout" component={Link} color="inherit">
              Logout
            </Button>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};
export default Header;
