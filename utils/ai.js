import OpenAI from "openai";
import { configDotenv } from "dotenv";

configDotenv({ debug: true });

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,

  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export default client;
