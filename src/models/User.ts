
import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import Document from "next/document";

export interface IUser extends Document {
    email: string;
    name?:string;
    image?:string;
    provider?:string
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    id?:string;

}

const UserSchema =new Schema<IUser>(
    {
        id:{
            type: String
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
       name:{
        type: String,
       },
        image:{
            type: String,
            default:"https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740"
       },
        provider: {
            type: String,
        },
        password:{
            type: String,
        }

},{timestamps: true})


UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    if(this.password)
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User=mongoose.models?.User || mongoose.model<IUser>("User", UserSchema)
export default User;