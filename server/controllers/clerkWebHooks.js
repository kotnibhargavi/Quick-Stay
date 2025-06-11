import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req,res)=>{
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
        console.log("Received webhook payload:", req.body);
        await Whook.verify(JSON.stringify(req.body),headers)
      

        // Getting from req body 

        const {data,type} = req.body 
        

        
        // Switch Case for different events 
        


        switch (type) {
            case "user.created":{
                const userData = {
                    _id : data.id,
                    email: data.email_addresses && data.email_addresses[0] ? data.email_addresses[0].email_address : "default@example.com",
                    username : data.first_name + data.last_name,
                    image : data.image_url,
                    }
                    await User.create(userData)
                    break;
            }
                
                
                
            case "user.updated":{
                const userData = {
                    _id : data.id,
                    email: data.email_addresses && data.email_addresses[0] ? data.email_addresses[0].email_address : "default@example.com",
                    username : data.first_name + data.last_name,
                    image : data.image_url,
                    }
                    await User.findByIdAndUpdate(data.id,userData)
                break;
            }

                
            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;
        
            default:
                break;
        }
        res.json({success:true, message:"Webhook Recieved"})

    }catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
      }
}

export default clerkWebHooks