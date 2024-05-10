//Alador
//serveren kjører her og det er her i port 5000 og vi har også forbindelsen til databasen
//hovedbibliotekene som er brukt på backend
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const sheepsRoutes = require("./routes/sheep-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");

const cors = require("cors");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//cors for frontend kobling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//sende alle forespørslene til disse rutingfilene. (sheep-routes.js) til alt som har å gjøre med sauene og (user-routes.js) til alt som har å gjøre med brukeren
app.use("/sheeps", sheepsRoutes);

app.use("/user", userRoutes);

//brukt path for å gjør det mulig å kjøre frontend i backend. Jeg brukte denne metoden til å kjøre nettstedet bare i heroku
app.use(express.static(path.join("public")));

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

//error handling
app.get("*", (req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//forbindelse med databasen ved bruk av mongoose. Nøkkelord som DB_USER, DB_PASSWORD og DB_NAME finnes i nodemon.json
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kr1wain.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
