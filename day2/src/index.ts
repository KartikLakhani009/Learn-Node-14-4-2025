import  express from 'express';
import APIRouter from './routes/api';
import htmlRouter from './routes/html';
import mw1 from './middleware/mw1';
import loggerFile from './middleware/loggerFile';
import { connectionSetup, connectionUrl } from './utils/connection';

const app = express();
const port = 3000;

connectionSetup(connectionUrl).then(()=>{
    console.log("MongoDB connected!");
}).catch((err)=>{
    console.log("MongoDB connection error", err);
});

// Parse incoming JSON
app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

app.use(loggerFile);

// html pages
app.use('/',htmlRouter);

// api pages
app.use('/api/user', mw1, APIRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});