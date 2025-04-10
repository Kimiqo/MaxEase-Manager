import express from "express";
import fetch from "node-fetch";
import "dotenv/config"

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://max-ease-manager.vercel.app"); // Update this for production later
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

export default async function handler(req, res) {
  const fileUrl = `https://drive.google.com/uc?export=download&id=${process.env.FILE_ID}`;
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to fetch file");
    const buffer = await response.buffer();
    res.setHeader("Content-Type", "application/octet-stream");
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).send("Failed to fetch timetable file");
  }
}