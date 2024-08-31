import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize GoogleGenerativeAI with the API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profileData } = req.body;

  if (!profileData) {
    return res.status(400).json({ error: 'Profile data is required' });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const prompt = `Create a funny roast for this LinkedIn profile data: ${JSON.stringify(profileData)}.`;
    const result = await chatSession.sendMessage(prompt);
    const roast = result.response.text();

    res.status(200).json({ roast });
  } catch (error) {
    console.error('Error generating roast:', error);
    res.status(500).json({ error: 'Failed to generate roast' });
  }
}
