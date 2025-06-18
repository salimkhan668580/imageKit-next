
import { IVideo } from '@/models/Video';
import { Image, Video} from '@imagekit/next';
async function getvideoData(){
  const data = await fetch('http://localhost:3000/api/video')
  return await data.json()

}
export default  async function Home() {
  const allData=  await getvideoData();

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-3 gap-0">
  {allData?.video?.map((data: IVideo, idx: number) => (
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
