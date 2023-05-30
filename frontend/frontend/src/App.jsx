import { useState, useMemo } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HomePage from "./pages/HomePage";
import ShoesPage from "./pages/ShoesPage";
import Register from "./pages/RegisterPage";
import Header from "./components/headerfooter/Header";
// import Footer from "./components/headerfooter/Footer";
import { createContext } from "react";
import { Box } from "@mui/material";
import CreateExercisePage from "./pages/CreateExercisePage";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CreateShoePage from "./pages/CreateShoePage";
import EditExerciseModal from "./components/display/EditExerciseModal";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
const queryClient = new QueryClient();

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
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Header />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Routes>
                  <Route
                    exact
                    path="/"
                    element={
                      <PrivateRoute>
                        <HomePage />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    exact
                    path="/shoes"
                    element={
                      <PrivateRoute>
                        <ShoesPage />
                      </PrivateRoute>
                    }
                  />

                  <Route exact path="/register" element={<Register />} />
                  <Route exact path="/login" element={<LoginPage />} />
                  <Route
                    exact
                    path="/shoes/create"
                    element={
                      <PrivateRoute>
                        <CreateShoePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/exercise/create"
                    element={
                      <PrivateRoute>
                        <CreateExercisePage />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Box>
              {/* <Footer /> */}
              <ReactQueryDevtools />
            </QueryClientProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
