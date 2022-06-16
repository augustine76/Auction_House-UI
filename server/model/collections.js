import mongoose from "mongoose";

const collectionSchema = mongoose.Schema({

    collectionId : {
        type : String,
        required : false
    },

    name : {
        type : String,
        required : true
    },

    symbol : {
        type : String,
        required : true
    },

    Image : {
        type : File,
        required : true
    },

    nfts : {
        type : [String],
        required : true
    },

    verified : {
        type : Boolean,
        required : true,
        default : false
    }
})