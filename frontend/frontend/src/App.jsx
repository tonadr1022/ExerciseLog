import { useState, useMemo } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HomePage from "./pages/HomePage";
import ShoesPage from "./pages/ShoesPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Header from "./components/headerfooter/Header";
import Footer from "./components/headerfooter/Footer";
import { createContext } from "react";
import { Box } from "@mui/material";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
const App = () => {
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/shoes" element={<ShoesPage />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/logout" element={<Logout />} />
            </Routes>
          </Box>
          <Footer />
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
