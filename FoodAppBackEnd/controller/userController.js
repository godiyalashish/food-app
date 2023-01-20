const getAllUsersController = async (req, res)=>{
    try{
        let users = await userModel.find();
        res.json(users);
    }catch(err){
        res.send(err.message);
    }
}

const profileController = async (req, res)=>{
    try{
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.json({
            data:user,
            message:"data about logged in user is sent"
    })
    }catch(err){res.send(err.message)}
    
}

module.exports = {
    getAllUsersController,
    profileController
}