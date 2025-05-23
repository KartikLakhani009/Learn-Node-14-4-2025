import {Queue} from 'bullmq';

const notification_queue = new Queue('email-queue',{
    connection: {
        host: 'localhost',
        port: 6379,
        password: undefined
    }
});


async function init() {
    const res = await notification_queue.add('send-email', {
        to: 'test@test.com',
        subject: 'Test Email',
        body: 'This is a test email',
    });
    console.log("job added to notification_queue res.id  " ,res.id);

    return res;
}

init();






