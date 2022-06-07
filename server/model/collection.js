import mongoose from "mongoose";

const collectionSchema = mongoose.Schema({

    name : {
        type : String,
        required : true
    },

    publicKey : {
        type : String,
        required : false
    },

    creator : {
        type : publicKey,
        required : false
    }

})

export const collection = mongoose.model("collection", collectionSchema)