// Alador & Sondre
/**
 * Sondre og Alador laget det første utkast ved å bruke ren react og deretter gjenskapte Alador det ved å bruke Material ui, og la til mer funksjonalitet, feilhåndtering og gjorde det responsiv
 *
 */
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Autocomplete,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MerkeNrContext from "../../Context/merkeNrContext"; // Adjusted path

function Sau({ handleRefresh }) {
  const [sheepData, setSheepData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { sheepId } = useParams();
  const navigate = useNavigate();
  const merkeNrArray = useContext(MerkeNrContext);
  const labels = {
    //brukte disse labels slik at feltene kan være på norsk
    name: "Navn",
    birthdate: "Fødsel",
    merkeNr: "MerkeNr",
    klaveNr: "KlaveNr",
    dead: "Død",
    father: "Far",
    mother: "Mor",
  };
  const [submitStatus, setSubmitStatus] = useState({
    //hovedmåten feilhåndtering er brukt i frontend. hvis feil, gjør error til true og legg til en melding i message. hvis suksess, gjør success til true og legg til en melding
    error: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    //et api-kall for å få data av en sau
    const fetchSheepData = async () => {
      setIsLoading(true);
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
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/sheeps/${sheepId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.sheep;
        setSheepData(data);
        setFormData({
          //endret skjemadataene slik at jeg kan trekke ut den nødvendige informasjonen og legge igjen unødvendig informasjon som IDer
          name: data.name,
          birthdate: data.birthdate ? data.birthdate.split("T")[0] : "",
          merkeNr: data.merkeNr,
          klaveNr: data.klaveNr,
          dead: data.dead ? data.dead.split("T")[0] : "",
          father: data.father || null,
          mother: data.mother || null,
        });
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

    fetchSheepData();
  }, [sheepId]);

  //et api-kall for å fjerne en sau
  const deleteSheep = async () => {
    setIsLoading(true);
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
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/sheeps/${sheepId}`,
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
        message: "Sauer ble fjernet!",
      });
      handleRefresh(); //oppdater listen i hjemesiden
      navigate("/"); //navigerer brukeren til hjemmesiden
    } catch (error) {
      setSubmitStatus({
        error: true,
        success: false,
        message: `Error: ${error.response?.data?.message || error.message}`,
      });
      setIsLoading(false);
    }
  };

  //et api-kall for å oppdatere info om en sau
  const updateSheep = async () => {
    setIsLoading(true);

    setSubmitStatus({ error: false, success: false, message: "" });
    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitStatus({
        error: true,
        success: false,
        message: "session not found, please login.",
      });
      setIsLoading(false);
      return;
    }
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/sheeps/${sheepId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setSheepData(formData); // oppdaterte skjemadataene slik at brukeren kan se endringene
      setEditMode(false);
      handleRefresh();
      setSubmitStatus({
        error: false,
        success: true,
        message: "Sauen er oppdatert!",
      });
    } catch (error) {
      // On error, do not update the formData but reset it to the last known good state (sheepData)

      setFormData(sheepData);
      setSubmitStatus({
        error: true,
        success: false,
        message: `Error: ${error.response?.data?.message || error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      updateSheep();
    }
    setEditMode(!editMode);
  };

  const openDeleteDialog = () => {
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
  };

  if (isLoading) {
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

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if ((name === "birthdate" || name === "dead") && value) {
      // Dette begrenser året til fire sifre når en bruker redigerer datoen direkte
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
      if (!isValidDate) {
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            maxWidth: "95%",
            width: "auto",
            m: 2,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Sau Informasjon
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
            {Object.entries(formData).map(([key, value]) => (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {labels[key] || key}:
                </Typography>

                {editMode ? (
                  key === "father" || key === "mother" ? (
                    /**
                     * far og mor merkenr felt bruker den array fra hjemmesiden/merkeNrContext.
                     * den ser sånn ut [ ["navn - merkeNr", merkeNr], ["navn2 - merkeNr2","merkeNr2"], [" ",""] ]
                     * brukeren ser bare det første elementet "navn - merker" i den auto complete, men når det er valgt. backend mottar det andre elementet som er bare merkeNr
                     * Jeg gjorde dette slik sånn at brukeren kan lettere identifisere sauene
                     */
                    <Autocomplete
                      value={
                        value
                          ? merkeNrArray.find((item) => item.merkeNr === value)
                          : null
                      }
                      options={merkeNrArray}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.merkeNr === value.merkeNr
                      }
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          [key]: newValue ? newValue.merkeNr : "",
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" fullWidth />
                      )}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      type={
                        key === "birthdate" || key === "dead" ? "date" : "text"
                      }
                      name={key}
                      value={value}
                      InputProps={{
                        readOnly: key === "merkeNr",
                      }}
                      onChange={handleDateChange}
                    />
                  )
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      cursor:
                        key === "father" || key === "mother"
                          ? "pointer"
                          : "default",
                    }}
                    onClick={() =>
                      key === "father" || key === "mother"
                        ? navigate(`/Sau/${value}`) //når en bruker trykker på far- eller mor merkeNr, blir brukeren ført til sau-infosiden deres
                        : null
                    }
                  >
                    {value || (key === "dead" && !value ? "Nei" : "")}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
          <CardActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button
              onClick={toggleEditMode}
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              color="primary"
              variant="contained"
              sx={{ marginX: 3 }}
            >
              {editMode ? "Lagre endringer" : "Rediger Info"}
            </Button>
            <Button
              onClick={openDeleteDialog}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{ marginX: 3 }}
            >
              Fjerne Sauen
            </Button>
          </CardActions>
        </Card>
        <Dialog open={dialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>{"Bekreft sletting"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Er du sikker på at du vil fjerne denne sauen? Denne handlingen kan
              ikke angres.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Avbryt
            </Button>
            <Button onClick={deleteSheep} color="error">
              Fjerne
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box> //et Material Ui-dialogvindu som vises når du prøver å fjerne en sau
  );
}

export default Sau;
