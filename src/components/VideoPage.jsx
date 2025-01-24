import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContentItem } from '../services/apiServices';
import { ContentItem } from '../services/models';


const VideoPage = () => {

const [item, setItem] = useState<ContentItem>('');

  const { itemId } = useParams();
    useEffect(() => {
      const fetchData = async () => {
        const result = await getContentItem(Number(itemId)); 
        setItem(result)
      }
      fetchData();
    }, [itemId]);

  return (
    <div className='bg-[#ECECEC] mx-20 rounded-xl p-5  mt-10 max-h-[35rem] overflow-y-auto'>
      <div className="flex justify-center items-center">
        <div className="w-full h-[32rem] aspect-video">
          <iframe
            className="w-full h-[33rem]"
            src={item?.video}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
    </div>
  </div>
  )
}

export default VideoPage