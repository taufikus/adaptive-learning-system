import { useEffect, useRef, useState } from 'react';
import { Link, useParams} from 'react-router-dom';
import { getContentItem } from '../services/apiServices';
import { ArrowRight, EyeOff, View, ScanFace } from 'lucide-react';
import WebGazerComponent from './WebGazer';
import {getTextSummary} from '../services/llm'


const ItemDetail = () =>{
    
  const [item, setItem] = useState(null);

  const textContainerRef = useRef(null);
  const [coordinates, setCoordinates] = useState({});
  const[isEyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);
  const[isShowFaceBox, setShowFaceBox] = useState(true);
  const[isShowGazeDot, setShowGazeDot] = useState(true);

  const [summary, setSummary] = useState('');


  const { itemId } = useParams();

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        const result = await getContentItem(Number(itemId));
        if (isMounted) {
          setItem(result);
  
          // Check if summary already exists
          if (!summary && result.content) {
            const summaryResult = await getTextSummary(result.content);
            if (isMounted) {
              setSummary(summaryResult);
              console.log("Summary fetched:", summaryResult);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [itemId, summary]);
  

 
  useEffect(() => {
    if (textContainerRef.current) {
      const rect =textContainerRef.current.getBoundingClientRect();
      setCoordinates({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      });

      
      setCoordinates(rect)
    }
  }, []);
  return (
    <div>
      <div className='bg-[#ECECEC] mx-4 sm:mx-8 md:mx-12 lg:mx-20 rounded-xl p-5 mt-5 h-[85vh] overflow-y-auto' ref={textContainerRef}>
        <p className='whitespace-pre-wrap text-justify text-lg'>
          {item?.title}
          {item?.content}
        </p>
        <div className='flex justify-end mt-8'>
           <Link
              to="#">
              <button className=' flex hover:cursor-pointer px-3 py-2 border border-transparent rounded-md shadow-sm text-white font-medium bg-slate-500'>
                <span>Proceed to Questionnaires</span> <ArrowRight className='text-white ml-2'/>
              </button>
          </Link>
      </div>
      </div>
      <div className='flex justify-evenly mt-5'>
      <button onClick={() => setShowFaceBox(!isShowFaceBox)} className=' flex hover:cursor-pointer px-3 py-2 border border-transparent rounded-md shadow-sm text-white font-medium bg-slate-500'>
          <span>{!isShowFaceBox ?  'Show' : 'Hide'} Face Visibility</span> 
          <span className='ml-3'>{isShowFaceBox ?  <View className='text-green-200'/> : <ScanFace className='text-red-500'/> } </span> 
        </button>
        <button onClick={() => setShowGazeDot(!isShowGazeDot)} className=' flex hover:cursor-pointer px-3 py-2 border border-transparent rounded-md shadow-sm text-white font-medium bg-slate-500'>
          <span>{!isShowGazeDot ?  'Show' : 'Hide'} Dot Visibility</span> 
          <span className='ml-3'>{isShowGazeDot ?  <View className='text-green-200'/> : <ScanFace  className='text-red-500'/> } </span> 
        </button>
        <button onClick={() => setEyeTrackingEnabled(!isEyeTrackingEnabled)} className=' flex hover:cursor-pointer px-3 py-2 border border-transparent rounded-md shadow-sm text-white font-medium bg-green-600'>
          <span>{!isEyeTrackingEnabled ?  'Enable' : 'Disable'}  Eye Tracking</span> 
          <span className='ml-3'>{isEyeTrackingEnabled ?  <View className='text-green-200'/> : <EyeOff className='text-red-500'/> } </span> 
        </button>
      </div>
        <WebGazerComponent isEyeTrackingEnabled={isEyeTrackingEnabled}  isShowFaceBox={isShowFaceBox} isShowGazeDot={isShowGazeDot} coordinates={coordinates} item={item} summary={summary}/>
    </div>
  );
}

export default ItemDetail;