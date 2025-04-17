import express from "express";
import router from "./routes/url";
import { dbConnect } from "./utils/dbConnect";

const app = express();
const PORT = process.env.PORT || 8005;

dbConnect("mongodb://localhost:27017/temp_short_url_db_1")
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api/url", router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
