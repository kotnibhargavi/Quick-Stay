import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    room:{type:mongoose.Schema.Types.ObjectId, ref:"room", required:true},
    hotel:{type:mongoose.Schema.Types.ObjectId, ref:"hotel", required:true},
    checkInDate:{type:Date, required:true},
    checkOutDate:{type:Date, required:true},
    totalPrice:{type:Number, required: true },
    guests :{type:Number, required: true },
    status:{
        type:String,
        enum :["pending","confirmed", "cancelled"],
        default : "pending",
    },
    paymentMethod : {
        type:String,
        required:true,
        default: "Pay At Hotel"
    },
    isPaid:{type:Boolean, default:false}
},{timestamps:true});


const Booking = mongoose.model("booking", bookingSchema);

export default Booking;