import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});