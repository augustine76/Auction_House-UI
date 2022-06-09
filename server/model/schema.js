import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const nftSchema = mongoose.Schema({
    
    url: String,
    publicKey: String,
    buyerWallet: String,
    sellerWallet: String,
    mintKey: String,
    isListed: {
        type: Boolean,
        default: false
    },
    isSell: {
        type: Boolean,
        default: false
    },
    isBuy: {
        type: Boolean,
        default: false
    },
    isSignedBySeller: {
        type: Boolean,
        default: false
    },
    isSignedByBuyer: {
        type: Boolean,
        default: false
    },
    listedAt: {
        type: Date,
        default: new Date()
    },
    amountToBuy: Number,
    amountToSell: Number,
    auctionHouseKey: String,
    userType: String
})

const userSchema = mongoose.Schema({

    email: String,
    publicKey: String,
    username: String,
    userType: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const signatureSchema = mongoose.Schema({

    signature: String,
    publicKey: String,
    isSigned: {
        type: Boolean,
        default: false
    },
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
export const Signature = mongoose.model("signatureSchema", signatureSchema)
