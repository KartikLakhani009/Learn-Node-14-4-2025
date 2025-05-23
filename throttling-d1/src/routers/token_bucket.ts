import { Router, NextFunction, Request, Response } from 'express';
import { waitTill } from '../utils/waitTill';


const TokenBucketRouter = Router();

type Token = {
    token: number;
    timestamp: number;
}

const tokenArray: Token[] = [
    {
        token: 1,
        timestamp: Date.now()
    },
    {
        token: 2,
        timestamp: Date.now()
    },
    {
        token: 3,
        timestamp: Date.now()
    }
];

type ConsumeToken = Token & { ip: string };

const consumeTokenArr: ConsumeToken[] = [];


const mid = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!;
    const token = tokenArray.shift();

    // console.log("ip : ", ip, 'token', token, "consumeTokenArr", consumeTokenArr);
    if (!token) {
        console.log("\n\n\nToo many requests", "tokenArray", tokenArray, "consumeTokenArr", consumeTokenArr);
        res.status(429).json({ message: 'Too many requests' });
        return;
    }
    consumeTokenArr.push({ ...token, ip });
    next();
};

TokenBucketRouter.get('/', mid, async (req, res) => {

    await waitTill(20000)
    const _release: ConsumeToken | undefined = consumeTokenArr.shift();
    if (_release) {
        tokenArray.push({ token: _release.token, timestamp: Date.now() });
        // console.log("after release tokenArray", tokenArray, " consumeTokenArr", consumeTokenArr);
    }
    res.send('Hello from TokenBucketRouter!');

});

export default TokenBucketRouter;