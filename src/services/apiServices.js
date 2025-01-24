
import axios from 'axios';

const contentEnvironment = "http://localhost:4000/contents";

export const getContent = async () => {
    try {

        const response = await axios.get(contentEnvironment);
        const data = response.data;
        if(data){
            return data;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}

export const getContentItem = async (itemId) => {
  if (!itemId) return;
  try {
    const url = `${contentEnvironment}/${itemId}`;
    const response = await axios.get(url);
    if(response.data){
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};