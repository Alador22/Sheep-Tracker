const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("server is running");
});

mongoose
  .connect(
    `mongodb+srv://alador:9fElxTe3xTMdvSL7@cluster0.dxz66lm.mongodb.net/sheeptracker?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("database connected!");
  })
  .catch((err) => {
    console.log(err);
  });

/* .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dxz66lm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  ) */
