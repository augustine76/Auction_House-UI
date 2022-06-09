import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import UserRoute from "./route/user.js";
import NftRoute from "./route/nft.js";
import cookieParser from "cookie-parser";

dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Routes
app.use(UserRoute);
app.use(NftRoute);

const PORT = process.env.PORT || 5000

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(PORT, () => console.log(`Server running on port:${PORT}`))
    )
    .catch((error) => console.log(error.message))