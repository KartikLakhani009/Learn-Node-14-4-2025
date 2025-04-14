import {  Router } from 'express';
import users from '../../MOCK_DATA.json'
import { validateUser } from '../utils/validateUser';

const APIRouter = Router();

APIRouter.get('/users', (req, res) => {
    res.json(users);
});

APIRouter.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

APIRouter.post('/user', (req, res) => {
    const newUser = req.body;

    console.log("newUser", newUser);
    const isValidUser = validateUser(newUser).error;
    console.log("isValidUser", isValidUser);
    if(isValidUser) {
        res.status(400).json({ error: isValidUser });
        return;
    }
    users.push(newUser);
    res.status(201).json(newUser);
    return;
});

APIRouter.put('/users/:id', (req, res) => {
    // validate user
    const userId = parseInt(req.params.id, 10);
    const updatedUser = {...req.body , id:userId};
    console.log("updatedUser", updatedUser);
    const isValidUser = validateUser(updatedUser).error;

    console.log("isValidUser", isValidUser);
    if(isValidUser) {
        res.status(400).json({ error: isValidUser });
        return;
    }
    // find user
    // update user
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

APIRouter.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(204).send({message:"User deleted"});
    } else {
        res.status(404).send({ message: 'User not found' });
    }
    // res.status(204).send({message: "User deleted"});
});

APIRouter.post('/user/post', (req, res) => {
    console.log("req.body", req.body);
    console.log("req.query", req.query);
    console.log("req.params", req.params);
    res.json({ status: 'Pending' });
});


export default APIRouter;

