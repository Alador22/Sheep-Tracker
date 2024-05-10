// Alador & Sondre
/**
 * Sondre laget det første utkastet med ren react, og deretter laget Alador en ny signup side med Material ui, og la til mer funksjonalitet, feilhåndtering og gjorde den responsiv
 *
 */
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function LeggTil({ handleRefresh }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/Login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    //sjekker om passordet er gyldig
    if (!password || !repeatPassword) {
      setError("Alle felt må fylles ut.");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Passordene er ikke like.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("passord må være minst 6 tegn langt.");
      setIsLoading(false);
      return;
    }

    //en POST-forespørsel sendt til serveren med et token
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      handleRefresh();
      redirectToLogin();
    } catch (error) {
      setError("Error " + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

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
        overflow: "hidden",
      }} //en Material Ui box for bakgrunnsbildet
    >
      <Container component="main" maxWidth="sm">
        <Card>
          <CardContent>
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
                Opprett profil
              </Typography>
            </Box>
            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  required
                  id="firstName"
                  label="Fornavn"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  fullWidth
                  required
                  id="lastName"
                  label="Etternavn"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{ flex: 1 }}
                />
              </Stack>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Epostadresse"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Passord"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="repeatPassword"
                label="Gjenta passord"
                type="password"
                id="repeatPassword"
                autoComplete="new-password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 2, mb: 1 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Lag Bruker"}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={redirectToLogin}
                sx={{ mt: 1 }}
              >
                Har du en konto allerede? Logg inn
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LeggTil;
