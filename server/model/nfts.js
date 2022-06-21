import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import pkgg from "validator";
const { isBase58 } = pkgg;
const nftSchema = mongoose.Schema({
    mintKey: {
        type: String,
        required: true,
        unique: true,
        // validate: [isBase58, "invalid mintkey"]
    },
    owner: {
        type: String,
        required: true,
        // validate: [isBase58, "invalid publickey"]
    },
    buyerWallet: String,

    inSale: {
        type: Boolean,
        default: true
    },

    priceAmount: {
        type: Number,
        required: true,
    },

    listedAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    priceAmount: Number

})
export const NFTS = mongoose.model("nfts", nftSchema)
