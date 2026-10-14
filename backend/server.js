const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Port = process.env.PORT || config.get("port.serverPort") || 4000;
const db_connection = process.env.MONGO_URI || config.get("db.connection-string");

const MasterRouter = require("./api/Routes/masterRouter");

app.use(express.static("public/images"));
app.use("/api/master", MasterRouter);

const httpServer = http.createServer(app);

mongoose
  .connect(db_connection)
  .then(() => {
    httpServer.listen(Port, () => {
      console.log(`HTTP Server running on port ${Port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
