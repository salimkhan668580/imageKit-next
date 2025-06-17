import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

import { NextRequest , NextResponse as res } from "next/server";

export const POST = async (req: NextRequest) => {


try {
    
    const {email,password}=await req.json()
    if(!email || !password){
        return res.json({ message: "email or password is missing" }, { status: 400 });
    }
      await dbConnect();
    const user=await User.findOne({email})
    if(user){
       return res.json({ message: "user already exists" }, { status: 400 });
    }

    await User.create({email,password})
    
   return  res.json({ message: "user registerd successfully" }, { status: 200 });

} catch (error) {
    console.error("Registration error:", error);
    return res.json({ message: "something went wrong" }, { status: 500 });
}

};

