import express from 'express';

import statusMonitor from 'express-status-monitor';

import fs from 'fs';

import path from 'path';



const app = express();
const PORT = process.env.PORT || 3000;

app.use(statusMonitor());

app.get('/', (_, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.get('/read', (_, res) => {
  const data = fs.readFileSync(path.join(__dirname, '50MB-TXT-FILE.txt'), 'utf-8');
  res.send(data);
  console.log('Read file completed');
  res.end();
});

app.get('/stream', (_, res) => {
   const stream = fs.createReadStream(path.resolve(__dirname, './50MB-TXT-FILE.txt'), 'utf-8');
   stream.on('data', (chunk) => {
    res.write(chunk);
   });
   stream.on('end', () => {
    console.log('Stream completed');
    res.end();
   });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});