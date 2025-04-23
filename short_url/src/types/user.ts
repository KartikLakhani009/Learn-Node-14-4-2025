import mongoose from "mongoose";

export type SignUpUser ={
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type User ={
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
}