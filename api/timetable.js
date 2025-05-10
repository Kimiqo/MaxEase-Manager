import fetch from 'node-fetch';

export default async function handler(req, res) {
  console.log(`Request received: ${req.url}, Method: ${req.method}`);

  // Enable CORS for production
  res.setHeader('Access-Control-Allow-Origin', 'https://max-ease-manager.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.error(`Invalid method: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Determine which timetable to fetch based on the path
  const path = req.url.split('/').pop();
  console.log(`Processing path: ${path}`);
  let fileId;

  if (path === 'exam') {
    fileId = process.env.FILE_ID;
  } else if (path === 'lecture') {
    fileId = process.env.LECTURE_FILE_ID;
  } else {
    console.error(`Invalid endpoint: ${path}`);
    return res.status(400).json({ error: `Invalid endpoint for ${path}. Use /api/exam or /api/lecture` });
  }

  // Check if fileId is defined
  if (!fileId) {
    console.error(`Missing file ID for ${path}`);
    return res.status(500).json({ error: 'Server configuration error: Missing file ID' });
  }

  const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  console.log(`Fetching file from: ${fileUrl}`);

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    res.setHeader('Content-Type', 'application/octet-stream');
    console.log(`Successfully fetched file for ${path}`);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error(`Error fetching file for ${path}:`, error);
    return res.status(500).json({ error: 'Failed to fetch timetable file' });
  }
}