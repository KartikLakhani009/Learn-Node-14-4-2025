import  express from 'express';
import APIRouter from './routes/api';
import htmlRouter from './routes/html';
import mw1 from './middleware/mw1';

const app = express();
const port = 3000;

// Parse incoming JSON
app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

// html pages

app.use('/',htmlRouter);

// api pages
// @ts-expect-error
app.use('/api', mw1, APIRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});