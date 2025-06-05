// import fetch from 'node-fetch';

// export default async function handler(req, res) {
//   console.log(`Request received: ${req.url}, Method: ${req.method}`);

//   // Enable CORS for production
//   res.setHeader('Access-Control-Allow-Origin', 'https://max-ease-manager.vercel.app');
//   res.setHeader('Access-Control-Allow-Methods', 'GET');

//   // Only allow GET requests
//   if (req.method !== 'GET') {
//     console.error(`Invalid method: ${req.method}`);
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   // Extract path from req.url (e.g., /api/exam-timetable -> exam-timetable)
//   const urlPath = req.url.split('?')[0]; // Remove query parameters
//   const path = urlPath.replace(/^\/api\//, '').replace(/\/$/, ''); // Remove /api/ prefix and trailing slash
//   console.log(`Extracted path: ${path}`);

//   let fileId;
//   if (path === 'exam-timetable') {
//     fileId = process.env.FILE_ID;
//   } else if (path === 'lecture-timetable') {
//     fileId = process.env.LECTURE_FILE_ID;
//   } else {
//     console.error(`Invalid endpoint: ${path}`);
//     return res.status(400).json({ error: 'Invalid endpoint. Use /api/exam-timetable or /api/lecture-timetable' });
//   }

//   // Check if fileId is defined
//   if (!fileId) {
//     console.error(`Missing file ID for ${path}`);
//     return res.status(500).json({ error: `Server configuration error: Missing ${path === 'exam-timetable' ? 'FILE_ID' : 'LECTURE_FILE_ID'}` });
//   }

//   const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
//   console.log(`Fetching file from: ${fileUrl}`);

//   try {
//     const response = await fetch(fileUrl);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch file: ${response.statusText}`);
//     }
//     const buffer = await response.buffer();
//     res.setHeader('Content-Type', 'application/octet-stream');
//     console.log(`Successfully fetched file for ${path}`);
//     return res.status(200).send(buffer);
//   } catch (error) {
//     console.error(`Error fetching file for ${path}:`, error);
//     return res.status(500).json({ error: `Failed to fetch ${path} file: ${error.message}` });
//   }
// }
import express from "express";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/lecture-timetable", async (req, res) => {
  const campus = req.query.campus?.toLowerCase() || "accra"; // Default to Accra
  const fileIdEnv = `LECTURE_FILE_ID_${campus.toUpperCase()}`;
  const fileId = process.env[fileIdEnv];

  if (!fileId) {
    console.error(`Missing file ID for campus: ${campus}`);
    return res.status(500).json({ error: `Server configuration error: Missing ${fileIdEnv}` });
  }

  const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  console.log(`Fetching lecture timetable for ${campus} from: ${fileUrl}`);

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to fetch file");
    const buffer = await response.buffer();
    res.setHeader("Content-Type", "application/octet-stream");
    res.status(200).send(buffer);
  } catch (error) {
    console.error(`Error fetching lecture timetable for ${campus}:`, error);
    res.status(500).send(`Failed to fetch lecture timetable for ${campus}`);
  }
});

app.get("/exam-timetable", async (req, res) => {
  const campus = req.query.campus?.toLowerCase() || "accra"; // Default to Accra
  const fileIdEnv = `EXAM_FILE_ID_${campus.toUpperCase()}`;
  const fileId = process.env[fileIdEnv];

  if (!fileId) {
    console.error(`Missing file ID for campus: ${campus}`);
    return res.status(500).json({ error: `Server configuration error: Missing ${fileIdEnv}` });
  }

  const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  console.log(`Fetching exam timetable for ${campus} from: ${fileUrl}`);

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to fetch file");
    const buffer = await response.buffer();
    res.setHeader("Content-Type", "application/octet-stream");
    res.status(200).send(buffer);
  } catch (error) {
    console.error(`Error fetching exam timetable for ${campus}:`, error);
    res.status(500).send(`Failed to fetch exam timetable for ${campus}`);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});