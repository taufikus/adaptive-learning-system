import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

  const ModalContent = ({
    title,
    closeModal,
    onOkay,
    data
  }) => {

    return (
      <div className="flex flex-col w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-2 border-b flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={closeModal} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
             <X />
          </button>
        </div>
  
        {/* Main Content */}
        <div className="px-6 py-4 flex-grow min-h-40 ">
          {data &&   
          <div>
             <p>{data.title}</p>
             <br></br>
             <p>Engagement Level : <span className='font-bold text-red-500'>LOW</span></p>
             <br></br>
             <p>It seems like you're facing some difficulties in understanding given paragraph, If yes then please click below link to understand it in video format</p>
             <br></br>
             <Link to="/video" state={{ videoUrl: data.video }} >
              <p className="text-blue-600 hover:text-blue-800 hover:underline">click here </p>
             </Link>

          </div>
          }
        </div>
  
        {/* Footer */}
        <div className="bg-gray-100 px-6 py-2 border-t flex justify-end rounded-b-lg">
          <button 
            onClick={closeModal} 
            className="px-4 py-2 text-white bg-red-500 rounded mr-2 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={onOkay} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    );
  };
  
  export default ModalContent;