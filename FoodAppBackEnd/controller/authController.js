const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const secretKey = "asasdasfefsdfsef131543213";
const useModel = require('../model/userModel');
const mailSender = require('../utilities/nodeMailer')



const signupController = async(req, res) =>{
    try{
        let data = req.body;
        console.log(data);
        let newUser = await userModel.create(data);
        res.json({
            message:"data received",
            data : data
        })}
    catch(err){
        res.send(err.message);
    }
};

const signInController = async function (req, res){
    try{
        let data = req.body;
        let {email, password} = data;
        if(email && password){
            let user = await useModel.findOne({email:email});
            if(user){
                if(user.password == password){
                    const token = jwt.sign({data: user['_id']}, secretKey);
                    console.log(token);
                    res.cookie("JWT",token)
                    res.send("user logged in");
                }else{
                    res.send("credentials do not match");
                }
            }else{
                res.send("no user found ")
            }
        }else{
            res.send("kindly enter correct email and password.")
        }
    }catch(err){
        console.log(err.message);
    }
}

const forgetPasswordController = async (req, res) =>{
    try {
        let {email} = req.body;
        let user = await userModel.findOne({email});
        if(user){
            let afterFiveMin = Date.now() + 1000*60*5;
            let otp = generateOtp();
            await mailSender(email, otp);
            user.otp = otp;
            user.otpExpiry = afterFiveMin;
            await user.save();
            res.json({
                data: user,
                message: "otp sent to your mail"
            })
        }else{
            res.json({
                message: "user with this email does not exists"
            })
        }
    } catch (error) {
        res.send(error.message);
    }
}

const resetPasswordController = async (req, res) =>{
    try {
        let{otp, password, confirmPassword, email} = req.body;
        let user = await userModel.findOne({email});
        let currentDate =  Date.now();
        if(currentDate > user.otpExpiry){
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            res.json({
                message:"OTP expired"
            })
        }else{
            if(user.otp != otp){
                res.json({
                    message :"OTP does not match"
                })
            }else{
                user = await userModel.findOneAndUpdate({otp}, {password, confirmPassword},{runValidators:true, new:true});
                user.otp = undefined;
                user.otpExpiry = undefined;
                await user.save();
                res.json({
                    user,
                    message : "user password reset completed successfully"
                })
            }
        }
    } catch (error) {
        res.send(error.message);
    }
}

function generateOtp(){
    return Math.floor(Math.random()*1000000);
}

function protectRoute(req, res, next){
    try{
        let cookies = req.cookies;
    let JWT = cookies.JWT;
    if(cookies.JWT){
        const token = jwt.verify(JWT, secretKey);
        let userId = token.data;
        req.userId = userId;
        next();
    }else{
        res.send('please login first');
    }
}catch(err){
        res.send(err.message);
    }
}

module.exports = {
    signupController,
    signInController,
    forgetPasswordController,
    resetPasswordController,
    generateOtp,
    protectRoute
}