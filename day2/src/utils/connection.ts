import mongoose from "mongoose";

export async function connectionSetup(url:string) {
    return mongoose.connect(url);
}

export const connectionUrl = "mongodb://localhost:27017/temp-user--db-1";
// mongodb://127.0.0.1:27017