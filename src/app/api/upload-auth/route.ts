
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {

    const imageUploadKit = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_URL as string,
    })

    return Response.json({
        imageUploadKit,
         publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_URL
         })
}