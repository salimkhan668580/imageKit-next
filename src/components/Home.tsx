"use client";

import { IVideo } from '@/models/Video';
import { Video } from '@imagekit/next';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from "react-spinners";

interface IVideoResponse {
  video: IVideo[];
}

function Home() {
  const [allData, setAllData] = useState<IVideoResponse | null>(null);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    getvideoData();
  }, []);

  async function getvideoData() {
    try {
    setLoading(true);
       const data = await fetch('/api/video');
    const orignal = await data.json();
    setAllData(orignal);
    } catch (error) {
      console.error("Error fetching video data:", error);
      
    }finally{
      setLoading(false);
    }
   
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <ClipLoader  loading={loading} size={50} />
      </div>
    );
  }

  if (!allData?.video?.length) {
    return (
      <div className="text-white text-2xl flex items-center justify-center h-[400px] font-semibold">
        No video found
      </div>
    );
  }



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-3 gap-0">
      {allData.video.map((data: IVideo, idx: number) => (
        <div
          key={idx}
          className="border border-white rounded-xl my-5 w-[300px] overflow-hidden bg-gray-900 shadow-md"
        >
          <Video
            urlEndpoint="https://ik.imagekit.io/salim66"
            src={data.VideoUrl}
            controls={data.transformation?.controls ?? true}
            width={300}
            height={300}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h2 className="text-white text-lg font-semibold mb-1">{data.title}</h2>
            <p className="text-gray-400 text-sm">{data.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
