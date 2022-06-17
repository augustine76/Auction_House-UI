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

    description : {
        type : String,
        required : true
    },

    image : {
        type : String,
        required : true
    },

    nfts : [{
        type : String,
    }],

    verified : {
        type : Boolean,
        required : false,
        default : false
    }
})

export const Collection = mongoose.model('collections',collectionSchema);
