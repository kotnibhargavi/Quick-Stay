import { timeStamp } from "console"
import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    _id : {type : String, require:true},
    username : {type : String, require:true},
    email : {type : String, require:true},
    image : {type : String, require:true},
    role : {type : String, enum:["user","hotelOwner"], default : "user"},
    recentSearchCities : {type : String, require:true},


},{timeStamps:true});


const User = mongoose.model("User",userSchema);

export default User;