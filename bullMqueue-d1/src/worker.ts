import { Worker } from 'bullmq';

const sendEmail = () =>new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(true);
    }, 1000);
})

const worker = new Worker('email-queue', async (job) => {
    try {
        console.log("job received " , job.id);
        console.log(job.data);
        await sendEmail();
        console.log("job completed " , job.id);
    } catch (error) {
        console.log("error in job " , error);
        throw error;
    }
}, {
    connection: {
        host: 'localhost',
        port: 6379,
        password: undefined
    }
});

// Handle process termination
process.on('SIGTERM', async () => {
    await worker.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    await worker.close();
    process.exit(0);
});


