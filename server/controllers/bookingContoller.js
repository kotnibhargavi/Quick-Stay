import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Stripe from 'stripe'
//Function to check availabily of room 

const checkAvailabilty = async ({checkInDate,checkOutDate,room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate :{$lte: checkOutDate},
            checkOutDate:{$gte:checkInDate},
        })
       const isAvailable =  bookings.length === 0 ;
       return isAvailable

    } catch (error) {
        console.log(error)
    }
}

// API to check the availibity of room 
// Post /api/bookings/check-availability 

export const checkAvailabiltyAPI = async (req,res)=>{
    try {
        const {room,checkInDate,checkOutDate} = req.body 
        const isAvailable = await checkAvailabilty({checkInDate,checkOutDate,room})
        res.json({success:true, isAvailable})
    } catch (error) {
        res.json({success:false, message: error.message})
        
    }
}


// API to create a new booking 
// Post /api/booking/book 

export const createBooking = async(req,res)=>{
    try {
        const {checkInDate,checkOutDate,room,guests} = req.body 
        const user = req.user._id 
    // Before Booking check availability 
    const isAvailable = await checkAvailabilty({checkInDate,checkOutDate,room})
    if(!isAvailable){
        return res.json({success:false, message:"Room is not availible"})
    }
    // Get totalPrice from room 
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight

    // calculate totalPrice based on nights 

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const timeDiff = checkOut.getTime() - checkIn.getTime() 
    const nights = Math.ceil(timeDiff/(1000*3600*24))

    totalPrice*= nights
    const booking = await Booking.create({
        user,
        room,
        hotel: roomData.hotel._id,
        guests: +guests,
        checkInDate,
        checkOutDate,
        totalPrice,
    })
    
    const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to: req.user.email,
        subject: 'Hotel Booking Details',
        html:`
        <h2>Your Booking Details</h2>
        <p>Dear ${req.user.username},</p>
        <p>Thank you for booking! Here are your details:</p>
        <ul>
            <li><strong>Booking ID:</strong> ${booking._id}</li>
            <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
            <li><strong>Location:</strong> ${roomData.hotel.address}</li>
            <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
            <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "$"}${booking.totalPrice}/night</li>
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>If you need to make changes, feel free to contact us</p>

        `
    }

    try {
        await transporter.sendMail(mailOptions)
      } catch (mailError) {
        console.log("Email sending failed:", mailError.message)
      }

    res.json({success:true, message:"Booking created successfully"})


    } catch (error) {
        console.log(error)
    res.json({success:false, message:"Failed to create booking"})
        
    }
}

// API to get all booking for a users 
// GET /api/bookings/user

export const getUserBookings = async(req,res)=>{
    try {
        const user = req.user._id
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt:-1})
        res.json({success:true, bookings})
    } catch (error) {
        res.json({success:false, message :"Failed to fetch bookings"})
    }
}

// GET Hotel bookings 

export const getHotelBookings = async(req,res)=>{
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if(!hotel){
            return res.json({success:false,message:"No hotel found"})

        }
        const bookings = await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdAt:-1})
        // Total Bookings 
        const totalBookings = bookings.length
        // Total revenue 
        const totalRevenue = bookings.reduce((acc,booking)=>acc+booking.totalPrice,0)
        res.json({success:true, dashboardData: {totalBookings,totalRevenue, bookings}})


    } catch (error) {
        res.json({success:false, message:"Failed to fetch bookings"})
    }
}

// payment 
export const stripePayment = async(req,res)=>{
    try {
        const {bookingId} = req.body
        const booking = await Booking.findById(bookingId)
        const roomData = await Room.findById(booking.room).populate('hotel');
        const totalPrice = booking.totalPrice;
        const {origin} = req.headers;
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const line_items =  [{
            price_data :{
                currency:'usd',
                product_data:{
                    name:roomData.hotel.name,
                },
                unit_amount:totalPrice*100
            },
            quantity :1,

        }]
        // create checkout session 
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode:'payment',
            success_url: `${origin}/loader/my-bookings`,
            cancel_url:`${origin}/my-bookings` ,
            metadata:{
                bookingId,
            }
        })
        res.json({success:true, url:session.url})
    } catch (error) {
        res.json({success:false, message:"Payment Failed"})
        
    }
}