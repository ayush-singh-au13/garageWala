const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const _ = require("lodash");
const connectDB = require("./src/config/db");
const morgan = require("morgan");

// load config
dotenv.config({ path: "./.env" });
const port = process.env.PORT;

connectDB();

app.use(morgan("dev"));

//middlewares
app.use(cors());
app.use(express.json());

//health check
app.get("/", (req, res) => {
  res.status(200).send("Everything is working fine !!");
});

//Routes
app.use("/api/v1/user", require("./src/routes/user.routes"));
app.use("/api/v1/dashboard", require("./src/routes/dashboard.routes"));
app.use("/api/v1/bookings", require("./src/routes/bookings.routes"));
app.use("/api/v1/partners", require("./src/routes/partners.routes"));
app.use("/api/v1/banner", require("./src/routes/banner.routes"));
app.use("/api/v1/services", require("./src/routes/services.routes"));

// api not found !handle 404
app.use("*", function (req, res, next) {
  res.status(404);

  return res.status(404).json({
    status: 404,
    message:
      "API NOT FOUND! Please check the endpoint and the HTTP request type! or contact at @Ayush 💗 ",
    data: {
      url: req.url,
    },
  });
});

module.exports = app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on PORT ${port}`
  );
});
