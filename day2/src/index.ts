import  express from 'express';
import APIRouter from './routes/api';
import htmlRouter from './routes/html';

const app = express();
const port = 3000;

// Parse incoming JSON
app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

// html pages

app.use('/',htmlRouter);
// api pages
app.use('/api', APIRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});