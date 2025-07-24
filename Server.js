require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")
const UserModel = require("./Models/UserModel.js");
const ResumeModel = require("./Models/ResumeModel.js")
const { Protect } = require("./Middleware/Token.js")

var cookieParser = require('cookie-parser')

const { ConnnectDb } = require("./Database.js")

ConnnectDb();

const authRoutes = require("./Routes/AuthRoutes")
const ResumeRoute = require("./Routes/ResumeRoutes.js")

const app = express();

app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.Client_URL || "*",
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use((express.json()));
app.use("/Auth", authRoutes)
app.use("/Resume", Protect, ResumeRoute)
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'),
    {
        setHeaders: (res, path) => {
            res.set("Access-Control-Allow-Origin", "http://localhost:5173")
        }
    }
));

const Port = process.env.Port || 3000

app.listen(Port, () => {
    console.log("Server Running at Port", Port);

})