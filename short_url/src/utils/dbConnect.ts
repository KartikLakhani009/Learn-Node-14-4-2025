import mongoose from "mongoose";

export async function dbConnect(url:string) {

    return mongoose.connect(url)
}