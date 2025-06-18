import { authOption } from '@/lib/authOptions';
import { dbConnect } from '@/lib/dbConnect';
import Video, { IVideo } from "@/models/Video";
import { log } from 'console';
import next from 'next';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse as res} from "next/server";


export const GET = async (req: NextRequest) => {
    try {
        await dbConnect();
        const video= await Video.find({}).sort({createdAt:-1});
        if(!video) return res.json({ message: "something went wrong" }, { status: 500 });

        return res.json({video},{ status: 200 });

    } catch (error) {
        console.error("video getting error:", error);
        return res.json({ message: "something went wrong" }, { status: 500 });
        
    }

}

export const POST=async(req: NextRequest) =>{
 
    try {
        const session= await getServerSession(authOption)
        if(!session) return res.json({ message: "unauthorized" }, { status: 401 });

        const body:IVideo= await req.json()
        console.log("this is body",body)

        if(!body.title || !body.description || !body.VideoUrl) return res.json({ message: "all fields are required" }, { status: 400 });
        const videoData={
         ...body,
         transformation:{
            width:1080,
            height:1920,
            controls:body.transformation?.controls??true,
            quality:body.transformation?.quality??100
         }
        

        }
   
         await dbConnect();
        const newVideo=new  Video(videoData)
        await newVideo.save()
        console.log(newVideo)
          return new Response(JSON.stringify({ newVideo }), { status: 200 });
        // return res.json({newVideo},{ status: 200 });

    } catch (error) {
        console.error("video uploading error:", error);
        return res.json({ message: "something went wrong" }, { status: 500 });
        
    }
}