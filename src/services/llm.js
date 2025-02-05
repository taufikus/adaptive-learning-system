import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const client = new OpenAI({
    apiKey:apiKey, dangerouslyAllowBrowser: true
});

const SUMMARY_SYSTEM_PROMPT = "You are a helpful AI assistant specializing in concise summarization. \
Your task is to summarize the given text in a clear, engaging manner. Focus on the main ideas and key points. \
Keep the summary brief, using simple language to improve understanding and engagement. \
Aim to capture the essence of the text in a way that's easy for someone who might be struggling with the original content to grasp quickly.";


const callLLM = async (userMessages) => {
    try {
      const messages = [
        { role: 'system', content:  SUMMARY_SYSTEM_PROMPT},
        ...userMessages
      ];
  
      const chatCompletion = await client.chat.completions.create({
        messages,
        model: 'gpt-4o', 
      });
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling LLM:', error);
      throw error;
    }
  };
  
  export const getTextSummary = async (paragraph) => {
    const summary = await callLLM([
        { role: 'user', content: `Please summarize the following paragraph:${paragraph}` }
      ]);

      if(summary){
        return summary;
      }
  }