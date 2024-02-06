const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log(`mongoose Connected`);
      })
      .catch((err) => {
        console.log(err.message);
      });

    app.use("/public", express.static(__dirname + "/public"));
    app.use(cors());
    app.use("/", routes);

    app.listen(process.env.PORT, "localhost", () => {
      console.info(`Server running on : http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
})();
