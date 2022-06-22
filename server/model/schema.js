import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const nftSchema = mongoose.Schema({

    url: String,
    publicKey: String,
    buyerWallet: String,
    sellerWallet: String,
    collectionName: {
        type: String,
    },
    mintKey: String,
    isListed: {
        type: Boolean,
        default: false
    },
    isBuy: {
        type: Boolean,
        default: false
    },
    isExecuteSell: {
        type: Boolean,
        default: false
    },
    listedAt: {
        type: Date,
        default: new Date()
    },
    amount: Number,
    auctionHouseKey: String
})

const userSchema = mongoose.Schema({

    publicKey: String,
    signature: String,
    isSigned: String,
    userEmail: String,
    userName: String,
    displayName: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const collectionSchema = mongoose.Schema({

    publicKey: String,
    collectionName: {
        type: String,
    },
    symbol: String,
    floorPrice: Number,
    description: String,
    image: String,
    isCollectionCreated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    auctionHouseKey: String
})


// userSchema.methods.getJWTToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE,
//     })
// }

export const User = mongoose.model("users", userSchema)
export const Nft = mongoose.model("nfts", nftSchema)
export const Collection = mongoose.model("collections", collectionSchema)

