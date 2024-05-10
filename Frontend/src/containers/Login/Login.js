// Alador & Sondre
/**
 * Sondre laget det første utkast ved å bruke ren react og  og deretter laget Alador en ny loggin side med Material ui, og la til mer funksjonalitet, feilhåndtering og gjorde den responsiv
 *
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  CircularProgress,
  Avatar,
  Alert,
} from "@mui/material";

function Login({ handleRefresh }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [submitStatus, setSubmitStatus] = useState({
    //hovedmåten feilhåndtering er brukt i frontend. hvis feil, gjør error til true og legg til en melding i message. hvis suksess, gjør success til true og legg til en melding
    error: false,
    success: false,
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async () => {
    setIsLoading(true);

    if (!email || !password) {
      setSubmitStatus({
        error: true,
        success: false,
        message: "Alle felt må fylles ut.",
      });
      setIsLoading(false);
      return;
    }
    //en Post request for å logge inn
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/login`,
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      login(response.data.token); //bruker authContext.js login funksjon med den nye token for å logge inn
      handleRefresh(); //kjører fetchSheep funksjonen i app.js
      navigate("/");
    } catch (error) {
      setSubmitStatus({
        error: true,
        success: false,
        message: `Error: ${error.response?.data?.message || error.message}`, // bruker feilmeldingen fra backend som message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToSignup = () => {
    navigate("/LeggTil"); //leggtil er den i sign up filen
  };

  return (
    <Box
      sx={{
        position: "fixed",
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
        overflow: "hidden",
      }} //en Material Ui box for bakgrunnsbildet
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={6} style={{ padding: "20px", marginTop: "30px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              padding: 1,
              width: "100%",
            }}
          >
            <Avatar
              alt="Sheep"
              src="./logo192.png"
              sx={{ width: 56, height: 56, marginBottom: 2 }}
            />
            <Typography variant="h5" component="h1" gutterBottom>
              Logg inn
            </Typography>
          </Box>
          {submitStatus.message && ( //dette er Material ui sin Alert tag som vi bruker for feil- eller suksessmeldinger
            <Alert
              variant="filled"
              severity={submitStatus.error ? "error" : "success"}
              style={{ marginBottom: "20px" }}
            >
              {submitStatus.message}
            </Alert>
          )}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="E-post"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Passord"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handleInputChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
              disabled={isLoading}
            >
              Logg inn
            </Button>
            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={redirectToSignup}
            >
              Har ikke en konto? Lag bruker
            </Button>
          </Box>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
