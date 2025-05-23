import { Router, Request, Response, NextFunction } from 'express';
import { waitTill } from '../utils/waitTill';

const LuckeryBucketRouter = Router();

const maxRequestAccept = 3;

const luckeryBucket = new Map<string, Record<string, number>>();

const arr :string[] = [];

const mid = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!;
    const count = luckeryBucket.size;

    console.log('count', count, "luckeryBucket", luckeryBucket);
    if (count >= maxRequestAccept) {
        console.log("\n\n\nToo many requests"," count : ", count , "luckeryBucket", luckeryBucket);
        res.status(429).json({ message: 'Too many requests' });
        return;
    }
    const ipMap = luckeryBucket.get(ip) || {};
    ipMap[ip] = (ipMap[ip] || 0) + 1;
    const key = Date.now().toString();
    arr.push(key);
    luckeryBucket.set(key, ipMap);
    next();
};
LuckeryBucketRouter.get('/', mid, async (req, res) => {
    await waitTill(20000)
    const key = arr.shift();
    if (key) {
        luckeryBucket.delete(key);
        // console.log("after release luckeryBucket", luckeryBucket);
    }
    
    res.send('Hello from LuckeryBucketRouter!');
});

export default LuckeryBucketRouter;