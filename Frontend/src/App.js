// Alador & Sondre
/**
 * Sondre laget det første utkast ved å bruke ren react og deretter gjenskapte Alador det ved å bruke Material ui, og la til mer funksjonalitet, feilhåndtering og gjorde det responsiv
 *
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./containers/Login/Login";
import LeggTil from "./containers/signup/LeggTil";
import Sau from "./containers/sau/Sau";
import Registrer from "./containers/leggSau/Registrer";
import Profile from "./containers/profil/Profile";
import Navbar from "./Component/navbar/Navbar";
import { AuthProvider } from "./Context/AuthContext";
import MerkeNrContext from "./Context/merkeNrContext";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
  Fab,
} from "@mui/material";

function App() {
  const [sheeps, setSheeps] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [hasSheeps, setHasSheeps] = useState(false);

  const merkeNrArray = sheeps.map((sheep) => ({
    //sauedataene legges inn i en array og sendes til merkeNrContext.js, slik at de kan brukes i far og mor autofullfør felter i andre sider
    label: `${sheep.name} (${sheep.merkeNr})`,
    merkeNr: sheep.merkeNr,
  }));

  useEffect(() => {
    //en Get forespørsel til serveren som sendes med et vedlagt token for autentisering. resultatet er en liste over sauer som tilhører brukeren
    const fetchSheepNames = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("session not found, please login.");
        }
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/sheeps",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (
          response.data &&
          Array.isArray(response.data.sheeps) &&
          response.data.sheeps.length > 0
        ) {
          setSheeps(response.data.sheeps);
          setHasSheeps(true);
        } else {
          setSheeps([]); // Sørger for at alle gamle data er slettet
          setHasSheeps(false);
        }
      } catch (error) {
        /*    console.error("Feil ved henting av sauenavn:", error);
        setError(
          "Feil ved henting av sauer: " +
            (error.response?.data?.message || error.message)
        );*/
        setHasSheeps(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSheepNames();
  }, [updateTrigger]);

  const filteredItems = sheeps.filter(
    (sheep) =>
      sheep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheep.merkeNr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //brukes av andre filer for å kjøre forespørselen om henting av sauer på nytt. f.eks: når en ny sau legges til, kjøres henteforespørselen slik at listen på hjemmesiden oppdateres med den nye sauen
  // eslint-disable-next-line no-unused-vars
  const handleRefresh = () => {
    setUpdateTrigger((prev) => !prev);
  };

  //Material UI loading screen
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  //alle rutene
  return (
    <MerkeNrContext.Provider value={merkeNrArray}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />

            <Routes>
              <Route
                path="/login"
                element={
                  <Login
                    handleRefresh={() => setUpdateTrigger((prev) => !prev)}
                  />
                }
              />
              <Route
                path="/LeggTil"
                element={
                  <LeggTil
                    handleRefresh={() => setUpdateTrigger((prev) => !prev)}
                  />
                }
              />
              <Route
                path="/Sau/:sheepId"
                element={
                  <Sau
                    handleRefresh={() => setUpdateTrigger((prev) => !prev)}
                  />
                }
              />
              <Route
                path="/Registrer"
                element={
                  <Registrer
                    handleRefresh={() => setUpdateTrigger((prev) => !prev)}
                  />
                }
              />
              <Route path="/Profile" element={<Profile />} />
              <Route
                path="/"
                element={
                  <HomePage
                    sheeps={filteredItems}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    hasSheeps={hasSheeps}
                  />
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </MerkeNrContext.Provider>
  );
}

function HomePage({ sheeps, searchTerm, setSearchTerm, hasSheeps }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //blir sendt til pålogging side hvis token finnes ikke i localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} //en Material Ui boks lagt til for et bakgrunnsbilde

      //vi bruker tilstandene "hasSheep" eller "!hasSheep" for å enten vise en liste hvor sauene skal vises eller en side for nye brukere som ber dem om å begynne å legge til sauer
    >
      <Container component="main" maxWidth={false}>
        {!hasSheeps ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              color="text.primary"
            >
              Du har ikke lagt til sau ennå.
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Legg til sauer
            </Typography>

            <Fab
              color="primary"
              aria-label="add"
              onClick={() => navigate("/Registrer")}
              sx={{ mt: 2 }}
            >
              <AddIcon />
            </Fab>
          </Box>
        ) : (
          <Box
            sx={{
              my: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Søk..."
              value={searchTerm} //søkefunksjonen
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: isLargeScreen ? "10%" : "60%",
                mb: 2,
                mt: 3,
                bgcolor: theme.palette.background.paper,
              }}
            />
            <TableContainer
              component={Paper} //bruker en modifisert Material Ui tabellkomponent
              sx={{
                width: "100%",
                maxWidth: "lg",
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Table
                stickyHeader
                aria-label="simple table"
                sx={{ bgcolor: theme.palette.secondary.main }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        color: "white",
                      }}
                    >
                      Navn
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        color: "white",
                      }}
                    >
                      Merkenummer
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sheeps
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((sheep, index) => (
                      <TableRow
                        key={index}
                        hover
                        onClick={() => navigate(`/Sau/${sheep.merkeNr}`)} //ved å klikke på tabellelementene kommer du til Sau.js siden.
                        sx={{ bgcolor: theme.palette.background.paper }}
                      >
                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                          {sheep.name}
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                          {sheep.merkeNr}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sheeps.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage="Rader:"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.secondary,
                }}
              />
            </TableContainer>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
