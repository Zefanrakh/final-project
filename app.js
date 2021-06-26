require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const rootRoute = require("./routes/index");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(rootRoute);
app.listen(PORT, () => {
  console.log("Running on port" + PORT);
});
