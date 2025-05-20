import express from 'express';
import axios from 'axios';

import redis from './db/redis-client';

const app = express();

app.get('/', (_, res) => {
    res.send('Hello World');
})

app.get('/todos', async (req, res) => {
    const data = await axios.get("https://jsonplaceholder.typicode.com/todos");
    res.json(data.data);
    return;
})


app.get('/redis/todos', async (req, res) => {

  const cachedTodos = await redis.get('todos');
  if (cachedTodos) {
    res.json(JSON.parse(cachedTodos));
    return;
  }

  const data = await axios.get("https://jsonplaceholder.typicode.com/todos");
  const { data: todos } = data;
  await redis.set('todos', JSON.stringify(todos));
  await redis.expire('todos', 500);
  res.json(todos);
  return;
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})