import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    redirectUrl: {
        type: String,
        required: true,
        trim: true
    },
    visitHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        default: null
    }
});

const URL = mongoose.model("URL", urlSchema);

export default URL;
