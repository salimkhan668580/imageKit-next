"use client" 
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useRouter } from 'next/navigation';
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const FileUpload = () => {
   const {data:session,status}=useSession();

  if(!session){

  return <div className='text-white  flex flex-col  items-center justify-center h-[400px] '>
    <p className='text-xl '>Please login first</p>

    <Link href="/login" className="btn border  px-6 py-2 rounded my-2 font-semibold">Login</Link>

  </div>
}

const [isUploading, setIsUploading] = useState(false);
    const router=useRouter()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [progress, setProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const abortController = new AbortController();

    /**
     * Authenticates and retrieves the necessary upload credentials from the server.
     *
     * This function calls the authentication API endpoint to receive upload parameters like signature,
     * expire time, token, and publicKey.
     *
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
     * @throws {Error}
     */
    const authenticator = async () => {
        try {

            const response = await fetch("http://localhost:3000/api/upload-auth",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {

                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("data",data)
            const { signature, expire, token} = data.imageUploadKit;
            const {publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const handleUpload = async () => {
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }


        const file = fileInput.files[0];

       
        let authParams;
        try {
            authParams = await authenticator();
            
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;
        try {
        setIsUploading(true);
            const uploadResponse = await upload({

                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
               
                abortSignal: abortController.signal,
            });

          const uploadSuccess=  await fetch("http://localhost:3000/api/video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    VideoUrl: uploadResponse.url,
                    thumbnail: uploadResponse.thumbnailUrl,
                    heigth: uploadResponse.height,
                    width: uploadResponse.width
                }),
                
            })

            if(!uploadSuccess.ok){
                toast.error("Video upload failed")
                throw new Error("Video upload failed")
            }
            router.push("/")
            console.log("Upload response:", uploadResponse);
        } catch (error:any) {
           
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
               toast.error(error)
                console.error("Upload error:", error);
            }
        }finally{
            setIsUploading(false)
        }
    };

    return (
<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
  {/* Page Title */}
  <h1 className="text-2xl font-bold my-2">📤 Upload Your Video</h1>

  {/* Page Description
  <p className="text-gray-400 mb-8 text-center max-w-lg">
    Provide a title and description, choose a video file, and upload it securely.
  </p> */}

  <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
    {/* Video Title Input */}
    <div>
      <label className="block mb-1 text-sm font-medium">Video Title</label>
      <input
        type="text"
        value={title}
        
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter video title"
        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Video Description Input */}
    <div>
      <label className="block mb-1 text-sm font-medium">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter video description"
        className="w-full px-4 py-2 h-24 resize-none rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>
    </div>

    {/* File Input */}
    <div className="cursor-pointer">
      <label className="block mb-1 text-sm font-medium">Select Video File</label>
      <input
      accept="video/*"
        type="file"
        ref={fileInputRef}

        className="block w-full cursor-pointer text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-600 file:text-white
          hover:file:bg-indigo-500"
      />
    </div>

    {/* Upload Button */}
   <button
  type="button"
  disabled={isUploading}
  onClick={handleUpload}
  className={`w-full font-semibold py-2 px-4 rounded-lg  transition duration-200
    ${isUploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white'}
  `}
>
  🚀 {isUploading ? 'Uploading...' : 'Upload Video'}
</button>

    {/* Upload Progress */}
    <div className="text-sm">
      <span className="block mb-1">Upload Progress:</span>
      <progress
        value={progress}
        max={100}
        className="w-full h-2 rounded bg-gray-700 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-indigo-500"
      ></progress>
      <div className="mt-1 text-right text-xs text-gray-400">
        {Math.floor(progress)}% complete
      </div>
    </div>
  </div>
</div>



    );
};

export default FileUpload;