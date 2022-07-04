import mongoose from "mongoose";

const collectionActivitySchema = mongoose.Schema({


    mintKey : {
        type : String,
        required : true
    },
    
    type :{
        type : String,
        enum : ['listed','cancelListing','sale']
    },

    buyer : {
        type : String
    },

    seller : {
        type : String
    },

    priceAmount : {
        type : Number
    },
    
    transactionId : {
        type : String
    },

    timeStamp: {
        type: Date,
        default: Date.now()
    }
})

const collectionSchema = mongoose.Schema({

    collectionId: {
        type: String,
        required: false
    },

    name: {
        type: String,
        required: true
    },

    symbol: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    nfts: [{
        type: String,
    }],

    floorPrice: {
        type: Number,
        default: 0,
        required: true
    },

    totalListedNfts: {
        type: Number,
        default: 0,
        required: true
    },

    totalUniqueHolders: {
        type: Number,
        default: 0,
        required: true
    },

    tradingVolume: {
        type: Number,
        default: 0,
        required: true
    },

    verified: {
        type: Boolean,
        required: false,
        default: false
    },
    
    creator: {
        type: String,
        required: true
    },

    owners :[{
        type: String
    }],

    activity : {
        type : [collectionActivitySchema]
    }

})

export const Collection = mongoose.model('collections', collectionSchema);
