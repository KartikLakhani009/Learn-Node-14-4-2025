import { Router } from 'express';
import slowDown from 'express-slow-down';

const limiter = slowDown({
    windowMs: 60 * 1000, // 1 minutes
    delayAfter: 2, // allow 2 requests per 1 minutes, then start slowing down
    delayMs: 500, // begin adding 500ms of delay per request above 2
});

const SlowRouter = Router();

SlowRouter.get('/', limiter, (req, res) => {
    console.log('SlowRouter');
    res.send('Hello from SlowRouter!');
});

export default SlowRouter;