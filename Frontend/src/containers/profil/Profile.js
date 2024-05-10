// Alador
// Alador & Sondre
/**
 * Alador laget det første utkast ved å bruke ren react og deretter gjenskapte han det ved å bruke Material ui, og la til mer funksjonalitet, feilhåndtering og gjorde det responsiv
 *
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../Context/AuthContext";
import {
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function Profile() {
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({
    //hovedmåten feilhåndtering er brukt i frontend. hvis feil, gjør error til true og legg til en melding i message. hvis suksess, gjør success til true og legg til en melding
    error: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    setSubmitStatus({ error: false, success: false, message: "" });
    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitStatus({
        error: true,
        success: false,
        message: "session not found, please login.",
      });
      return;
    }
    if (token) {
      try {
        //brukerinformasjonen i profilen er hentet fra token
        const decodedToken = jwtDecode(token);
        setUser({
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          email: decodedToken.email,
        });
      } catch (error) {
        console.error("Kunne ikke dekode token:", error);
      }
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Se etter tomme felt og angi feil
    const newErrors = {};
    if (!oldPassword.trim())
      newErrors.oldPassword = "Gammelt passord må oppgis";
    if (!newPassword.trim()) {
      newErrors.newPassword = "Nytt passord må oppgis";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Nytt passord må være på minst 6 tegn";
    }

    // Hvis det er feil, oppdater tilstanden og ikke fortsett med API kalling
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Fjern tidligere feil
    setErrors({});

    // Fortsett med API-kall hvis ingen feil
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/user/profile`,
        { oldPassword, newPassword },
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
        message: "Passordet er oppdatert!",
      });
      setNewPassword("");
      setOldPassword("");
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

  //api-kallet for å slette en bruker
  const handleAccountDeletion = async () => {
    setIsLoading(true);
    setSubmitStatus({ error: false, success: false, message: "" });
    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitStatus({
        error: true,
        success: false,
        message: "session not foun, please login.",
      });
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      //token fjernes og bruker sendes til logginn siden
      localStorage.removeItem("token");
      logout();
      navigate("/login");
    } catch (error) {
      setSubmitStatus({
        error: true,
        success: false,
        message: `Error: ${error.response?.data?.message || error.message}`,
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const togglePasswordChange = () => {
    setShowPasswordChange((prev) => !prev);
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
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
      <Box sx={{ maxWidth: 600, margin: "auto", p: 2, mt: 20 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Min Profil
            </Typography>
            <Typography>
              <strong>Mail:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Navn:</strong> {user.firstName} {user.lastName}
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                onClick={togglePasswordChange}
                startIcon={
                  showPasswordChange ? <CloseOutlinedIcon /> : <EditIcon />
                }
              >
                {showPasswordChange ? "Lukk" : "Endre Passord"}
              </Button>
              <Button
                onClick={openDeleteDialog}
                color="error"
                variant="contained"
                startIcon={<DeleteIcon />}
                disabled={isLoading}
              >
                Slett Konto
              </Button>
            </Stack>
            {showPasswordChange && (
              <Box
                component="form"
                onSubmit={handlePasswordChange}
                sx={{ mt: 2, width: "100%" }}
              >
                {submitStatus.message && ( //dette er Material ui sin Alert tag som vi bruker for feil- eller suksessmeldinger
                  <Alert
                    variant="filled"
                    severity={submitStatus.error ? "error" : "success"}
                    style={{ marginBottom: "20px" }}
                  >
                    {submitStatus.message}
                  </Alert>
                )}
                <TextField
                  margin="normal"
                  label="Gjeldende Passord"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword || ""}
                />

                <TextField
                  margin="normal"
                  label="Nytt Passord"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword || ""}
                />
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isLoading}
                    startIcon={<EditIcon />}
                  >
                    Endre Passord
                  </Button>
                </Stack>
              </Box> //et Material Ui-dialogvindu som vises når du prøver å slette en konto
            )}
          </CardContent>
        </Card>
        {isLoading && <CircularProgress />}
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>{"Bekreft sletting"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Er du sikker på at du vil slette kontoen din? Denne handlingen kan
              ikke angres.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Avbryt
            </Button>
            <Button onClick={handleAccountDeletion} color="error">
              Slett
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Profile;
