
import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import Document from "next/document";

export interface IUser extends Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

}

const UserSchema =new Schema<IUser>(
    {
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        }

},{timestamps: true})


UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User=mongoose.models?.User || mongoose.model<IUser>("User", UserSchema)
export default User;