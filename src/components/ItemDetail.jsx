import { useEffect, useRef, useState } from 'react';
import { Link, useParams} from 'react-router-dom';
import Modal from "./Modal";
import ModalContent from "./ModalContent";
import { getContentItem } from '../services/apiServices';
import { ArrowRight, EyeOff, View } from 'lucide-react';
import WebGazerComponent from './WebGazer';


/*  <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded">
                  Open Modal
                </button> */
const ItemDetail = () =>{
    
  const [item, setItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textContainerRef = useRef(null);
  const [coordinates, setCoordinates] = useState({});
  const[isEyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { itemId } = useParams();

  useEffect(() => {
      const fetchData = async () => {
        const result = await getContentItem(Number(itemId)); 
        setItem(result)
      }
      fetchData();
  }, [itemId]);

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

      console.log("text-coord", rect)
    }
  }, []);
/* TODO
    useEffect(() => {
      const timer = setTimeout(() => {
        openModal();
      }, 5000); 
  
      // Cleanup function
      return () => clearTimeout(timer);
    }, []); 
*/
  return (
    <div>
      <h2>{itemId}</h2>
      <div className='bg-[#ECECEC] mx-20 rounded-xl p-5  mt-5 max-h-[34rem] overflow-y-auto' ref={textContainerRef} >
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
      <div className='flex justify-center mt-5'>
        <button onClick={() => setEyeTrackingEnabled(!isEyeTrackingEnabled)} className=' flex hover:cursor-pointer px-3 py-2 border border-transparent rounded-md shadow-sm text-white font-medium bg-slate-500'>
          <span>{!isEyeTrackingEnabled ?  'Enable' : 'Disable'}  Eye Tracking</span> 
          <span className='ml-3'>{isEyeTrackingEnabled ?  <View className='text-green-500'/> : <EyeOff className='text-red-500'/> } </span> 
        </button>
      </div>
      <div className="p-4">
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onAfterOpen={() => console.log('Modal opened')}
          onAfterClose={() => console.log('Modal closed')}
        >
          <ModalContent
            title=""
            closeModal={closeModal}
            onOkay={closeModal}
            data={item}
            >
                    
            </ModalContent>
          </Modal>
        </div>
        <WebGazerComponent isEyeTrackingEnabled={isEyeTrackingEnabled}/>
    </div>
  );
}

export default ItemDetail;