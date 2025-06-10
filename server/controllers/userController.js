// GET /api/user 
export const getUser = async (req,res)=>{
    try {
        const role = req.user.role
        const recentSearchCities = req.user.recentSearchCities
        res.json({success:true , role,recentSearchCities})
    } catch (error) {
        res.json({success : false, message: error.message})
    }
}

// store user recent search cities 


export const storeRecentStoredCities = async (req,res)=>{
    try {
        const {recentSearchCities} = req.body 
        const user = await req.user 
        if(user.recentSearchCities.length<3){
            user.recentSearchCities.push(recentSearchCities)
        }
        else{
            user.recentSearchCities.shift()
            user.recentSearchCities.push(recentSearchCities)
        }
        await user.save()
        res.json({success:true , message:"city added"})
    } catch (error) {
        res.json({success:false , message:error.message})
    }
} 