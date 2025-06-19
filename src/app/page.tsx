
import { IVideo } from '@/models/Video';
import { Image, Video} from '@imagekit/next';
import { metadata } from './layout';
import Home from '@/components/Home';


metadata.title="Home page"

export default  function page() {
  

  return (
    <>
    <Home/>
    </>
   

  );
}
