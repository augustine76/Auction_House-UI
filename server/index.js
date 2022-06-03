import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import UserRoute from "./route/user.js";
import User from "./model/user.js";
import cors from "cors"
// const cors = require("cors");
// app.use(cors);
dotenv.config()
const app = express()

app.use(express.json())

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Routes
app.use(UserRoute);

const PORT = process.env.PORT || 5000

mongoose
    .connect('mongodb+srv://isha:isha2180@cluster0.govgi.mongodb.net/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(PORT, () => console.log(`Server running on port:${PORT}`))
    )
    .catch((error) => console.log(error.message))
