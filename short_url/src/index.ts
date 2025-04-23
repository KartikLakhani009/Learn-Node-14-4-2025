import express from "express";
import router from "./routes/url";
import { dbConnect } from "./utils/dbConnect";
import path from "path";
import pagesRoute from "./routes/pagesRoute";
import cookieParser from "cookie-parser";
import { checkIfUserLoggedIn } from "./middleware/authMid";

const app = express();
const PORT = process.env.PORT || 8005;

dbConnect("mongodb://localhost:27017/temp_short_url_db_1")
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });


// set view engin
app.set("view engine", "ejs");
// set view directory
// app.set("views","./views"); //not worked
// app.set("views", path.join(__dirname, "./views")); /worked
app.set("views",path.join(__dirname, '.', 'views'));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// html pages
app.use("/",pagesRoute);

// Routes
app.use("/api/url", checkIfUserLoggedIn, router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
