import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req,res)=>{
    try {
        
        // creating a svix instance with clerk web hook 

        const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        console.log(Whook , "1")
        //Getting headers
        const headers = {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"],
        }
        console.log(headers, "2") 
        // Verifying headers
        const isVerified = await Whook.verify(JSON.stringify(req.body),headers)
        console.log(isVerified , "3")

        // Getting from req body 

        const {data,type} = req.body 
        console.log(req.body, "4" )
        console.log(data, "5" )
        console.log(type, "6" )

        const userData = {
            _id : data.id,
            email: data.email_addresses[0].email_address,
            username : data.first_name + data.last_name,
            image : data.image_url,
            }
        // Switch Case for different events 
        console.log(userData, "7" )


        switch (type) {
            case "user.created":
                const k = await User.create(userData)
                console.log(k)
                break;
            case "user.updated":
                await User.findByIdAndUpdate(data.id,userData)
                break;
            case "user.deleted":
                await User.findByIdAndDelete(data.id)
                break;
        
            default:
                break;
        }
        res.json({sucess:true, message:"Webhook Recieved"})

    }catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
      }
}

export default clerkWebHooks