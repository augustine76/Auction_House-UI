import mongoose from "mongoose";


const userActivitySchema = mongoose.Schema({


    mintKey : {
        type : String,
        required : true
    },
    
    type :{
        type : String,
        enum : ['buy','listed','cancelListing','sell']
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

const userSchema = mongoose.Schema({

    publicKey: String,
    displayName: String,
    userName: String,
    signature: String,
    isSigned: {
        type: Boolean,
        default: false
    },                                                                      
    createdAt: {
        type: Date,
        default: Date.now()
    },

    activity : {
        type : [userActivitySchema]
    }
})

export const User = mongoose.model("users", userSchema)