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
import Typewriter from 'typewriter-effect';
import { LuSearchCode } from "react-icons/lu";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoIosCopy } from "react-icons/io";
import { CiSquareRemove } from "react-icons/ci";


const FileUpload = () => {
   const {data:session}=useSession();
const [promptData, setPromptData] = useState("");
const [responseData, setResponseData] = useState<string>("");
const [loading,setLoading] = useState<boolean>(false);



const [isUploading, setIsUploading] = useState(false);
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
     * 
     * 
     */


      if(!session){

  return <div className='text-white  flex flex-col  items-center justify-center h-[400px] '>
    <p className='text-xl '>Please login first</p>

    <Link href="/login" className="btn border  px-6 py-2 rounded my-2 font-semibold">Login</Link>

  </div>
}
    const authenticator = async () => {
        try {

            const response = await fetch("/api/upload-auth",{
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

          const uploadSuccess=  await fetch("/api/video", {
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
           
            toast.success("Video uploaded successfully")
            setTitle("");
            setDescription("");
            setProgress(0);
            fileInput.value = ""; // Clear the file input
            console.log("Upload response:", uploadResponse);
        } catch (error:unknown) {
           
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
               toast.error(error instanceof Error ? error.message : "Something went wrong");
                console.error("Upload error:", error);
            }
        }finally{
            setIsUploading(false)
        }
    };

    const generateHandler=async()=>{
      try {
        setLoading(true);
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: promptData }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate response");
        }

        const data = await response.json();
       const formattedData = data.reply.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
        setResponseData(formattedData);
      } catch (error) {
        console.error("Error generating response:", error);
      }finally{
        setPromptData("");
        setLoading(false);
      }
    }

    return (
 

<div className="flex w-full bg-gray-900 text-white">

  <div className="w-[40%] flex flex-col items-center justify-center px-4">
   

    <div className="w-full h-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
     <h1 className="text-2xl font-bold my-2">📤 Upload Your Video</h1>
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
        className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-200
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


  <div className="w-[60%] flex flex-col  rounded-2xl   px-4 bg-gray-800">
    <h1 className="text-2xl font-bold text-center my-4">💬 Ask OpenAI</h1>

    <div className="!w-full bg-gray-800 p-6 rounded-2xl shadow-xl space-y-5">

    <div className="flex items-center  gap-2">
    <input
      type="text"
      value={promptData}
      onChange={(e) => setPromptData(e.target.value)}
      id="user-input"
      placeholder="Type your question..."
      className="flex-1 px-4 py-2  rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <button
      id="send-btn"
      type="button"
      onClick={generateHandler}
      className="px-4 py-3 bg-gray-600 cursor-pointer   hover:bg-indigo-500 text-white rounded-lg transition duration-200"
    >
      <LuSearchCode className="w-4 h-4" />
    </button>
  </div>

      {/* Output */}
      <div className="text-sm">
        <span className="block mb-1 text-gray-400 font-medium">Response:</span>
       <div className="relative w-full">
        
  {/* Copy Button */}

  {/* Output Box */}
  <div
    id="output"
    className="w-full h-[300px] overflow-y-auto custom-scroll p-4 bg-gray-700 text-white rounded-lg border border-gray-600 whitespace-pre-wrap"
  >
      <div className="flex  rounded-lg relative  justify-end items-center">

  <button
    onClick={()=>setResponseData("")}
    className=" mx-2 cursor-pointer  bg-gray-600 hover:bg-gray-500 text-white text-sm px-2 py-1 rounded-md transition"
  >

  <CiSquareRemove  />
  </button>

  <button
    onClick={() => {
      const textToCopy = typeof responseData === "string" ? responseData : "";
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        toast.success("✅ Copied to clipboard!");
      }
    }}
    className=" cursor-pointer  bg-gray-600 hover:bg-gray-500 text-white text-sm px-2 py-1 rounded-md transition"
  >

    <IoIosCopy />
  </button>

  </div>
    {loading ? (
      "Generating response..."
    ) : responseData ? (
      <Typewriter
        options={{
          delay: 20,
      
        }}
        onInit={(typewriter) => {
          typewriter.typeString(responseData).start();
        }}
      />
      // <Typewriter
      //   options={{
      //     strings: responseData,
      //     autoStart: true,
      //     delay: 25,
      //   }}
      // />
    ) : (
      "Response will appear here..."
    )}
  </div>

</div>

      </div>
    </div>
  </div>
</div>




    );
};

export default FileUpload;