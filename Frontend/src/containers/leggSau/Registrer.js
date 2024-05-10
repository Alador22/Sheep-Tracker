// Alador & Sondre
/**
 * Sondre laget det første utkast ved å bruke ren react og deretter gjenskapte Alador det ved å bruke Material ui, og la til mer funksjonalitet, feilhåndtering  og gjorde det responsiv
 *
 */

import React, { useState, useContext } from "react";
import axios from "axios";
import MerkeNrContext from "../../Context/merkeNrContext";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Autocomplete,
} from "@mui/material";

function Register({ handleRefresh }) {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    merkeNr: "",
    klaveNr: "",
    dead: "",
    father: "",
    mother: "",
  });

  const merkeNrArray = useContext(MerkeNrContext); //en Array av sauenavn og øre merkeNr hentet fra hjemmesiden som skal brukes i auto-complete felter

  const [submitStatus, setSubmitStatus] = useState({
    //hovedmåten feilhåndtering er brukt i frontend. hvis feil, gjør error til true og legg til en melding i message. hvis suksess, gjør success til true og legg til en melding
    error: false,
    success: false,
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Navn må fylles ut";
    if (!formData.merkeNr.trim())
      newErrors.merkeNr = "Merkenummer må fylles ut";

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      setSubmitStatus({
        error: true,
        success: false,
        message: "Vennligst fyll ut alle obligatoriske felter.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitStatus({
        error: true,
        success: false,
        message: "Session not found, please login.",
      });
      return;
    }

    //en POST-forespørsel om å legge til en ny sau
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sheeps/save`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitStatus({
        error: false,
        success: true,
        message: "Sauer ble registrert!",
      });
      handleRefresh(); //kjører fetchSheep funksjonen i app.js for å oppdatere tabellen
      setFieldErrors({});
    } catch (error) {
      setSubmitStatus({
        error: true,
        success: false,
        message: `Error: ${error.response?.data?.message || error.message}`, // bruker feilmeldingen fra backend som message
      });
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
      }} //en Material Ui box for bakgrunnsbildet
    >
      <Container component="main" maxWidth="sm">
        <Paper elevation={6} style={{ padding: "20px", marginTop: "30px" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Legg Til Sau
          </Typography>
          {submitStatus.message && ( //dette er Material ui sin Alert tag som vi bruker for feil- eller suksessmeldinger
            <Alert
              variant="filled"
              severity={submitStatus.error ? "error" : "success"}
              style={{ marginBottom: "20px" }}
            >
              {submitStatus.message}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 4 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Navn"
              name="name"
              autoComplete="name"
              autoFocus
              InputLabelProps={{
                style: { color: "black" },
              }}
              value={formData.name}
              onChange={handleChange}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name || ""}
            />
            <TextField
              margin="normal"
              fullWidth
              id="birthdate"
              label="Fødselsdato"
              name="birthdate"
              type="date"
              InputLabelProps={{ shrink: true, style: { color: "black" } }}
              value={formData.birthdate}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="merkeNr"
              label="Merkenummer"
              name="merkeNr"
              InputLabelProps={{
                style: { color: "black" },
              }}
              value={formData.merkeNr}
              onChange={handleChange}
              error={!!fieldErrors.merkeNr}
              helperText={fieldErrors.merkeNr || ""}
            />
            <TextField
              margin="normal"
              fullWidth
              id="klaveNr"
              label="Klavenummer"
              name="klaveNr"
              InputLabelProps={{
                style: { color: "black" },
              }}
              value={formData.klaveNr}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="dead"
              label="Dødsdato"
              name="dead"
              type="date"
              InputLabelProps={{ shrink: true, style: { color: "black" } }}
              value={formData.dead}
              onChange={handleChange}
            />

            <Autocomplete
              id="father-autocomplete"
              options={merkeNrArray}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Fars merkenr" margin="normal" />
              )}
              /**
               * far og mor merkenr felt bruker den array fra hjemmesiden/merkeNrContext.
               * den ser sånn ut [ ["navn - merkeNr", merkeNr], ["navn2 - merkeNr2","merkeNr2"], [" ",""] ]
               * brukeren ser bare det første elementet "navn - merker" i den auto complete, men når det er valgt. backend mottar det andre elementet som er bare merkeNr
               * Jeg gjorde dette slik sånn at brukeren kan lettere identifisere sauene
               */
              value={
                formData.father
                  ? merkeNrArray.find(
                      (option) => option.merkeNr === formData.father
                    )
                  : undefined
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  father: newValue ? newValue.merkeNr : "",
                });
              }}
              renderOption={(props, option) => (
                <li {...props}>{option.label}</li>
              )}
              isOptionEqualToValue={(option, value) =>
                option.merkeNr === value.merkeNr
              }
            />
            <Autocomplete
              id="mother-autocomplete"
              options={merkeNrArray}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Mors merkenr" margin="normal" />
              )}
              value={
                formData.mother
                  ? merkeNrArray.find(
                      (option) => option.merkeNr === formData.mother
                    )
                  : undefined
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  mother: newValue ? newValue.merkeNr : "",
                });
              }}
              renderOption={(props, option) => (
                <li {...props}>{option.label}</li>
              )}
              isOptionEqualToValue={(option, value) =>
                option.merkeNr === value.merkeNr
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Legg Til
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
