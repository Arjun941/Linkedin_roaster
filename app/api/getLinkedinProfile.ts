// app/api/getLinkedInProfile.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Profile URL is required.' });
  }

  try {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SCRAPIN_API_KEY}`,
      },
    };

    const response = await fetch(`https://api.scrapin.io/enrichment/profile?profileUrl=${encodeURIComponent(url)}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch LinkedIn profile data:', errorText);
      return res.status(500).json({ error: 'Failed to fetch LinkedIn profile data' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching LinkedIn profile data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
