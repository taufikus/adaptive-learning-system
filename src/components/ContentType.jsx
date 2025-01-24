import { useEffect, useState } from 'react';
import {getContent} from '../services/apiServices'
import {getTextGroupedContent} from '../services/utilities'
import { useNavigate } from "react-router-dom"
import { ContentKind } from '../services/models';

const ContentType = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [contentItems, setContentItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const navigate = useNavigate();
     
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

      useEffect(() => {
        const fetchData = async () => {
          if (!activeTab) return;
  
            const data = await getContent();
            //const filteredContent = data.filter((item: ContentItem) => item.type === activeTab);
            const groupedList = getTextGroupedContent(data);
            console.log("groupedList",groupedList)
            if(groupedList.length>0){
              setContentItems(groupedList);
            }
            
        };
      
        fetchData();
      }, []);

  const handleItemSelect = (item, activeTab) => {
        setSelectedItemId(item.id);
        if(activeTab==ContentKind.TEXT){
          navigate(`/text/${Number(item.id)}`);
        }else if(activeTab==ContentKind.VIDEO){
          navigate(`/video/${Number(item.id)}`);
        }
        
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-[90%]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Select Content Type</h2>
        <div className="border-b border-gray-200">
          <nav className="flex justify-center -mb-px space-x-8" aria-label="Tabs"> {/* Centered nav */}
            <button
              onClick={() => handleTabClick(ContentKind.TEXT)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'text'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Text
            </button>
            <button
              onClick={() => handleTabClick(ContentKind.VIDEO)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'video'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Video
            </button>
          </nav>
        </div>

        <div className="mt-6  max-h-[25rem] overflow-y-auto">
        {activeTab === ContentKind.TEXT && (
          <>
            {contentItems.length > 0 ? (
              <>
                {contentItems.map((group) => (
                  <div key={group.category} className="mb-6">
                    <h3 className="text-lg text-indigo-600 textfont-bold mb-3">{group.category}</h3>
                    <ul>
                      {group.list.map((item) => (
                        <li
                          key={item.id}
                          className={`p-4 rounded shadow mb-2 cursor-pointer transition-colors duration-200 ${
                            selectedItemId === item.id
                              ? 'bg-[#ECECEC] border-2 border-gray-300'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => handleItemSelect(item,activeTab)}
                        >
                          <p className="line-clamp-1 text-sm"><span className='font-bold'>{item.title}</span> :- {item.content}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500">No content available for Text.</p>
            )}
          </>
        )}
          {activeTab === ContentKind.VIDEO && (
           <>
           {contentItems.length > 0 ? (
             <>
               {contentItems.map((group) => (
                 <div key={group.category} className="mb-6">
                   <h3 className="text-lg text-indigo-600 textfont-bold mb-3">{group.category}</h3>
                   <ul className='flex flex-wrap justify-start gap-10 ml-10'>
                     {group.list.map((item) => (
                       <li
                         key={item.id}
                         className={`p-4 rounded shadow mb-2 ml-3 mt-3 cursor-pointer transition-colors duration-200 ${
                           selectedItemId === item.id
                             ? 'bg-[#ECECEC] border-2 border-gray-300'
                             : 'bg-white hover:bg-gray-50'
                         }`}
                         onClick={() => handleItemSelect(item,activeTab)}
                       >
                         <p className="line-clamp-1 text-sm mb-2"><span className='font-bold'>{item.title}</span></p>
                         <div className="">
                            <iframe
                              className=""
                              src={item?.video}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            ></iframe>
                          </div>
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
             </>
           ) : (
             <p className="text-gray-500">No content available for Videos.</p>
           )}
         </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentType;