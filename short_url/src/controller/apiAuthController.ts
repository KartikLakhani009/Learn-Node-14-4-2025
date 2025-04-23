import { Request, Response } from "express";
import { validateSignupUser } from "../utils/validateSignupUser";
import UserModel from "../model/userSchema";
import { addUserToMap } from "../services/authStorage";

export async function registerUser(req: Request, res: Response) {
    const { username, password, email } = req.body;
    const errors = validateSignupUser(req.body);
    if(errors.length > 0) {
        res.sendStatus(400).json({
            error: errors[0],
        });
        return;
    }
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        res.status(400).json({
            error: "User already exists",
        });
        return;
    }
    // Create a new user
    const newUser = await UserModel.create({
        name: username,
        email,
        password,
    });
    if (!newUser) {
        res.status(500).json({
            error: "Internal server error",
        });
        return;
    }
    res.status(201).json({ message: 'User registered successfully' });
}
export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email, password });
    if (!existingUser) {
        res.status(400).json({
            error: "User not found",
        });
        return;
    }
    const token = await addUserToMap(existingUser);
    
    res.status(200).json({ message: 'User logged in successfully', token:token });
}
export async function logoutUser(req: Request, res: Response) {
    
    res.status(200).json({ message: 'User logged out successfully' });
}