import mongoose from "mongoose";
const userSchema = mongoose.Schema({

    publicKey: String,
    displayName: String,
    userName: String,
    signature: String,
    isSigned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export const User = mongoose.model("users", userSchema)