import express from 'express';
import routes from './routes';
import logger from './routes/middleware/logger';
import errorHandler from './routes/middleware/error';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to log requests
app.use(logger);
app.use('/api', routes);

// // Catch all unknown endpoints
// app.use((req, res, next) => {
//     console.log(`Unknown endpoint: ${req.originalUrl}`);
//     // const error = new Error(`Endpoint ${req.originalUrl} not found`) as any;
//     // error.status = 404;
//     // next(error); // Pass to error handler
//     res.status(404).json({
//         status: 'error',
//         message: `Endpoint ${req.originalUrl} not found`,
//       });
//   });

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
