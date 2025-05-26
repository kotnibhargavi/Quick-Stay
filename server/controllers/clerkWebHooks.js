import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async ()=>{
    try {
        // creating a svix instance with clerk web hook 
        const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        //Getting headers
        const headers = {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"],
        }

        // Verifying headers
        await Whook.verify(JSON.stringify(req.body),headers)

        // Getting from req body 
        const {data,type} = req.body 
        const userData = {
            _id : data.id,
            email : data.email_adresses[0].email_adresses,
            username : data.first_name + data.last_name,
            image : data.image_url,
            }
        // Switch Case for different events 
        switch (type) {
            case "user.created":
                await User.create(userData)
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

    } catch (error) {
        console.log(error.message)
        res.json({sucess:false, message:error.message})
    }
}

export default clerkWebHooks