import {  Router } from 'express';
import { validateUser } from '../utils/validateUser';
import { User } from '../model/user';

const APIRouter = Router();

APIRouter.get('/', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

APIRouter.get('/:id', async (req, res) => {
    const userId =req.params.id
    console.log("userId", userId);
    const user = await User.findById(userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

APIRouter.post('/', async (req, res) => {
    const newUser = req.body;

    console.log("newUser", newUser);
    const isValidUser = validateUser(newUser).error;
    console.log("isValidUser", isValidUser);
    if(isValidUser) {
        res.status(400).json({ error: isValidUser });
        return;
    }
    const result = await User.create(newUser);
    console.log("result", result);
    res.status(201).json({message: "User created", user: result});
    return;
});

APIRouter.put('/:id', async (req, res) => {
    // validate user
    const userId = req.params.id;
    const updatedUser = req.body;
    console.log("updatedUser", updatedUser);
    const isValidUser = validateUser(updatedUser).error;

    console.log("isValidUser", isValidUser);
    if(isValidUser) {
        res.status(400).json({ error: isValidUser });
        return;
    }
    // find user
    // update user
    const result = await User.findByIdAndUpdate(userId,updatedUser,{new:true});
    // if (userIndex !== -1) {
    //     users[userIndex] = { ...users[userIndex], ...req.body };
    //     res.json(users[userIndex]);
    // } else {
    //     res.status(404).json({ message: 'User not found' });
    // }

    if (result) {
        res.json({ message: 'User updated', user: result });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

APIRouter.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    const result = await User.findByIdAndDelete(userId);
    console.log("result", result);
    res.status(200).json({ message: 'User deleted' });
    // if (userIndex !== -1) {
    //     users.splice(userIndex, 1);
    //     wrong status code here
    //     res.status(204).send({message:"User deleted"});
    // } else {
    //     res.status(404).send({ message: 'User not found' });
    // }
    // res.status(204).send({message: "User deleted"});
});

APIRouter.post('/post', (req, res) => {
    console.log("req.body", req.body);
    console.log("req.query", req.query);
    console.log("req.params", req.params);
    res.status(501).json({ status: 'Pending' });
});


export default APIRouter;

