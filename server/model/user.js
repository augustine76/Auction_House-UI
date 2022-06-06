import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const nftSchema = mongoose.Schema({

    url: String
})

const userSchema = mongoose.Schema({

    email: String,
    username: String
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

export const User = mongoose.model("users", userSchema)
export const Nft = mongoose.model("nfts", nftSchema)
