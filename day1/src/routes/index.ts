import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello from TypeScript + Express!');
});

router.get('/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

// router.get('/error', (req, res, next) => {
//     // throw new Error('This is a test error!');
//     next(new Error('This is a test error!'));
// });

router.get('/test-error', (req: Request, res: Response, next: NextFunction) => {
    // DON'T throw — use next()
    next(new Error('This is a test error!'));
});




export default router;