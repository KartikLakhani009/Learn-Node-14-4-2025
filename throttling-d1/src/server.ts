import express from 'express';
import TokenBucketRouter from './routers/token_bucket';
import SlowRouter from './routers/slow';
import LuckeryBucketRouter from './routers/luckery_bucket';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.use('/token-bucket', TokenBucketRouter);
app.use('/slow', SlowRouter);
app.use('/luckery-bucket', LuckeryBucketRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});