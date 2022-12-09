import mongoose from "mongoose";
import authRoles from "../utils/authRoles";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import crypto from 'crypto'
import config from "../config";


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true,"Name is required"],
            maxLength: [50,"Name must be less than 50"]
        },
        email:{
            type: String,
            required: [true,"email is required"],
            unique: true
        },
        password:{
            type: String,
            required: [true,"password is required"],
            minLength: [8,"password must be atleast 8"],
            select: false
        
        },
        role:{
            type:String,
            enum: Object.values(authRoles),
            default: authRoles.USER
        },
        forgotpasswordToken: String,
        forgotpasswordExpiry: Date
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    if(!this.modified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next()
})

// compare password
userSchema.methods = {
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },
    
    getJwtToken: function(){
        return JWT.sign(
          {
            _id: this._id,
            role:this.role
          },
          config.JWT_SECRET,
          {
            expiresIn: config.JWT_EXPIRY
          }  
        )
    }
}




export default mongoose.model("User",userSchema)