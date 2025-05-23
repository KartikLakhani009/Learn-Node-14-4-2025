import express from 'express';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs:  60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
});


const app = express();
const PORT = process.env.PORT || 3000;

app.use(limiter);

app.get('/', (_, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});