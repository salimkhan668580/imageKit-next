import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
  const {email}= await req.json();
  try {
    dbConnect();
    const getUser= await User.findOne({email});
      return NextResponse.json({ message:"user found",getUser }, { status: 200});
  } catch (error) {
    console.log("error while getting user", error);
  }


};


export const PUT=async(req:NextRequest)=>{
  const {email,image,name}=await req.json();
  try {
    dbConnect();
    const getUser= await User.findOne({email});
    if(!getUser) return NextResponse.json({ message:"user not found" }, { status: 400});
    getUser.image=image;
    getUser.name=name;

    await getUser.save();
      return NextResponse.json({ message:"User updated successfully" }, { status: 200});
  } catch (error) {
    console.log("error while getting user", error);
  }
}
