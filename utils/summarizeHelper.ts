import { Groq } from 'groq-sdk';

const dotenv = require('dotenv');
dotenv.config();


// summarizes the current filtered bookmarks using Groq 
export async function summarizeAnswer(text: string) {
    const client = new Groq({
      apiKey: process.env.GROQ_KEY,
    });
  
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize the following text in 2-3 sentences:\n\n${text}`,
        },
      ],
      model: "llama3-70b-8192",  
    });
  
    // Return the summary if it exists, else return a fallback message
    return chatCompletion.choices[0].message.content || 'Summary could not be generated';
  }
  
  
  