import mongoose from "mongoose";
import authRoles from "../utils/authRoles";
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


export default mongoose.model("User",userSchema)