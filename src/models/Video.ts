import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
    title: string;
    description: string;
    Videourl: string;
    thumbnail: string;
    createdAt: Date;
    updatedAt: Date;
    transformation:{
        width: number,
        height: number,
        controls: boolean,
        quality:number
    }
    
}

const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        Videourl: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        transformation: {
            width:{
              type: Number,
              default: 1080
            },
            height: {
              type: Number,
              default: 1920
            },
            quality: {
              type: Number,
              min: 1,
              max: 100
            },

           
            controls: Boolean
    }
},{timestamps: true})

const Video=mongoose.models?.Video || mongoose.model<IVideo>("Video", videoSchema)
export default Video