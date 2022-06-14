import mongoose from "mongoose";

const bidSchema = mongoose.Schema({
    
    mint : {
        type : String,
        required : true
    },

    owner : {
        type : String,
        required : true
    },

    currentBid : {
        type : Number,
        required : true,
    }

})

export const bid = mongoose.model("Bids", bidSchema);