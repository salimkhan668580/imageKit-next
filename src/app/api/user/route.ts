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
