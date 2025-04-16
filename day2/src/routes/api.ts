import {  Router } from 'express';
import { handlerCreateUser, handlerDeleteUser, handlerGetUserById, handlerGetUsers, handlerUpdateUser } from '../controller/user';

const APIRouter = Router();

// APIRouter.get('/', handlerGetUsers);

// APIRouter.post('/', handlerCreateUser);

APIRouter.route('/').get(handlerGetUsers).post(handlerCreateUser);

APIRouter.route('/:id')
    .get(handlerGetUserById)
    .put(handlerUpdateUser)
    .delete(handlerDeleteUser);

APIRouter.post('/post', (req, res) => {
    console.log("req.body", req.body);
    console.log("req.query", req.query);
    console.log("req.params", req.params);
    res.status(501).json({ status: 'Pending' });
});


export default APIRouter;

