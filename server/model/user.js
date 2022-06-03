import mongoose from "mongoose";

const UserSchema = mongoose.Schema({

    url: String
})
const User = mongoose.model("users", UserSchema)

export default User;