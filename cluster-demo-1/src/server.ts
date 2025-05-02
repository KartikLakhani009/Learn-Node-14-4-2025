import express from 'express';
import cluster from 'cluster';
import os from 'os';

import process from 'process';

const numCPUs = os.cpus().length;

const totalThreads = os.availableParallelism();



if(cluster.isPrimary){
  console.log(`Master ${process.pid} is running`);
  console.log(`Total threads: ${totalThreads}` , " total cpus : ", numCPUs);
  for(let i = 0; i < totalThreads; i++){
    cluster.fork();
  }
}else{
  
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get('/', (_, res) => {
    res.send('Hello from Express + TypeScript! from worker ' + process.pid);
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} from worker ${process.pid}`);
  });
  
}
