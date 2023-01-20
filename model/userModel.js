const req = require('express/lib/request');
const mongoose = require('mongoose');
const pass = require('../secrets');
const dbLink = `mongodb+srv://dbUser:${pass}@cluster0.y7v0x8g.mongodb.net/?retryWrites=true&w=majority`;
const { Schema } = mongoose;
mongoose.connect(dbLink).then(()=>{
    console.log("connected")
}).catch((err) =>{
    console.log(err);
});

let userSchema = new Schema({
    name:{
        type: String,
        required : [true, "Name is required"]
    },
    password : {
        type : String,
        required : [true, "password is required"]
    },
    confirmPassword:{
        type : String,
        required : [true, "confirm password is required"],
        //custom validator
        validate :{
            validator:function (){
                return this.password == this.confirmPassword;
            },
            message:"password mismatch"
        }
    },
    email : {
        type : String,
        required : [true,"email is required"],
        unique: [true, "email already exists"]
    },
    phoneNumber : {
        type : String,
        minLength: [10,"phone number less than 10 digits"],
        maxLength :[10, "phone number greater than 10 digits"]
    },
    pic : {
        type : String,
        default : ""
    },
    address :{
        type : String
    },
    otpExpiry :{
        type : Date
    },
    otp :{
        type:String
    }
})

const userModel = mongoose.model('foodUserModel', userSchema);

module.exports = userModel;