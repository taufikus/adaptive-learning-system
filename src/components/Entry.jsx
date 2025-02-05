import { LogIn } from 'lucide-react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const Entry = () => {

  const navigate = useNavigate();
  
  const handleStartExperiment = async () => {
    try {
      //const response = await axios.get('http://localhost:8765/tobii_pro/connect/') // TODO - handle response
      navigate(`/content-type`);
      console.log('Connection successful')
  } 
  catch (error) {
    console.error('Connection unsuccesful', error);
    // Handle the error as needed (e.g., display an error message to the user)
  }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 flex items-center justify-center">
      
      <div className="bg-white/80 backdrop-blur-md p-12 rounded-2xl shadow-2xl w-full max-w-lg transform hover:scale-105 transition duration-300">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight">Reading Experiment</h1>
        <p className="text-lg text-gray-700 text-center leading-relaxed mb-8">
          Explore diverse reading styles and content. <br />
          Begin your personalized reading journey now.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleStartExperiment} className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Start Experiment 
            <LogIn className='ml-3'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;