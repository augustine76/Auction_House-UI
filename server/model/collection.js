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
    floorPrice:{
        type:Number,
        default:0,
        required : true
    },

    verified : {
        type : Boolean,
        required : false,
        default : false
    },
    creator:{
        type : String,
        required : true
    }
})

export const Collection = mongoose.model('collections',collectionSchema);
