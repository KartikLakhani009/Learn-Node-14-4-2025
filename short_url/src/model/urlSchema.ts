import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    originalUrl: {
        type: String,
        required: true,
        unique: true,
    },
    visitHistory:[{
        timeStamp:{
            type:Number,
        }
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{
    timestamps: true,
});

const Url = mongoose.model("Url", urlSchema);


export default Url;