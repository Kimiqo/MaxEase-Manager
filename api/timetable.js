import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Enable CORS for production and local development
  res.setHeader('Access-Control-Allow-Origin', 'https://max-ease-manager.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Determine which timetable to fetch based on the path
  const path = req.url.split('/').pop();
  let fileId;

  if (path === 'exam-timetable') {
    fileId = process.env.FILE_ID;
  } else if (path === 'lecture-timetable') {
    fileId = process.env.LECTURE_FILE_ID;
  } else {
    return res.status(400).json({ error: 'Invalid endpoint. Use /api/exam-timetable or /api/lecture-timetable' });
  }

  // Check if fileId is defined
  if (!fileId) {
    return res.status(500).json({ error: 'Server configuration error: Missing file ID' });
  }

  const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    res.setHeader('Content-Type', 'application/octet-stream');
    return res.status(200).send(buffer);
  } catch (error) {
    console.error(`Error fetching file for ${path}:`, error);
    return res.status(500).json({ error: 'Failed to fetch timetable file' });
  }
}

// import express from "express";
// import fetch from "node-fetch";
// import "dotenv/config";

// const app = express();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET");
//   next();
// });

// app.get("/exam-timetable", async (req, res) => {
//   const fileUrl = `https://drive.google.com/uc?export=download&id=${process.env.FILE_ID}`;
//   try {
//     const response = await fetch(fileUrl);
//     if (!response.ok) throw new Error("Failed to fetch file");
//     const buffer = await response.buffer();
//     res.setHeader("Content-Type", "application/octet-stream");
//     res.status(200).send(buffer);
//   } catch (error) {
//     console.error("Error fetching file:", error);
//     res.status(500).send("Failed to fetch timetable file");
//   }
// });

// app.get("/lecture-timetable", async (req, res) => {
//   const fileUrl = `https://drive.google.com/uc?export=download&id=${process.env.LECTURE_FILE_ID}`;
//   try {
//     const response = await fetch(fileUrl);
//     if (!response.ok) throw new Error("Failed to fetch file");
//     const buffer = await response.buffer();
//     res.setHeader("Content-Type", "application/octet-stream");
//     res.status(200).send(buffer);
//   } catch (error) {
//     console.error("Error fetching file:", error);
//     res.status(500).send("Failed to fetch timetable file");
//   }
// })

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });