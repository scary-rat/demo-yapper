// imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./connecDB/connectDB.js";
import userRouter from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

// configs
dotenv.config();

// database connection
// starting mai database connection garni, database connect vnena vani / error vyo vani, express haru khi initialise nai hudaina
// error vye not necessary to run the app ni ta so database connect nai vne na vani no use of doing other process, dicect close hunxa

connectDB();

// constants
const app = express();
const PORT = process.env.PORT || 3000;



// cloudnary config (yo chai middlewares haru vanda agadi garnu parxa re configurations haru)
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
})


// body parsers middleware
// limit set greko kina vaney mahile larger image upload garna khojda file too large vanyo ani cors le allow grena tyo file upload garna
// so limit 10 mb greko

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// other middlewares
// cors
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Your frontend origin
    credentials: true, // Allow cookies to be sent and received
}));




// routes 
// aba hamile middle ware use garera kun user.routes.js ma define greko userRouter variable which holds function xa ni teslie mount greko
// app.use middle ware ho so according to this /api/users ma yedi khi request auxa teslie userRouter ma redicect gra vaneko jastai ho
// ki ta /api/users ma request auni bitikai pahila userRouter lie mount gara ani tesma j j functionality haru define greko xa tyo execute gara
app.use("/api/users", userRouter)
app.use("/api/posts", postRoute)

// server
app.listen((PORT), () => {
    console.log(`server is running on port ${PORT}`)
})

