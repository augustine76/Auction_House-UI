import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const nftSchema = mongoose.Schema({

    url: String,
    publicKey: String,
    isSell: {
        type: Boolean,
        default: false
    },
    sellAt: {
        type: Date,
        default: new Date()
    },
    amount: Number
})

const userSchema = mongoose.Schema({

    email: String,
    publicKey: String,
    username: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

// userSchema.methods.getJWTToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE,
//     })
// }

export const User = mongoose.model("users", userSchema)
export const Nft = mongoose.model("nfts", nftSchema)
