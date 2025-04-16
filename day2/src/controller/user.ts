import { User } from "../model/user";
import { Request, Response } from "express";
import { validateUser } from "../utils/validateUser";

export async function handlerGetUsers(req: Request, res: Response) {
    const users = await User.find({});
    res.json(users);
}

export async function handlerGetUserById(req: Request, res: Response) {
    const userId = req.params.id
    console.log("userId", userId);
    const user = await User.findById(userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

export async function handlerCreateUser(req: Request, res: Response) {
    const newUser = req.body;

    console.log("newUser", newUser);
    const isValidUser = validateUser(newUser).error;
    console.log("isValidUser", isValidUser);
    if (isValidUser) {
        res.status(400).json({ error: isValidUser });
        return;
    }
    const result = await User.create(newUser);
    console.log("result", result);
    res.status(201).json({ message: "User created", user: result });
    return;
}

export async function handlerUpdateUser(req: Request, res: Response) {
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

}

export async function handlerDeleteUser(req: Request, res: Response) {
    const userId = req.params.id;
    const result = await User.findByIdAndDelete(userId);
    console.log("result", result);
    res.status(200).json({ message: 'User deleted' });
}