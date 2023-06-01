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
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
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
              {user && (
                <>
                  <IconButton
                    to="/create-exercise"
                    component={Link}
                    size="large"
                    edge="start"
                    color="inherit">
                    <AddCircleIcon />
                  </IconButton>
                  <Button to="/my-exercises" component={Link} color="inherit">
                    My Exercises
                  </Button>{" "}
                  <Button to="/my-shoes" component={Link} color="inherit">
                    My Shoes
                  </Button>
                </>
              )}
            </Stack>
            {user && (
              <Typography
                variant="h5"
                component="div"
                noWrap
                sx={{ marginRight: 4 }}>
                Hello {user.first_name}
              </Typography>
            )}
            {user ? (
              <Button onClick={logoutUser} color="inherit">
                Logout
              </Button>
            ) : (
              <Button to="/login" component={Link} color="inherit">
                Login
              </Button>
            )}
            <ThemeToggle />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};
export default Header;
