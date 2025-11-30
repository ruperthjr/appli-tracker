const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = process.env.OPENROUTER_KEY
  ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_KEY,
    })
  : null;

async function main({ query }) {
  if (!openai) {
    throw new Error("OPENROUTER_KEY not configured");
  }
  
  const completion = await openai.chat.completions.create({
    model: "x-ai/grok-4-fast:free",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: query,
          },
        ],
      },
    ],
  });
  return completion;
}

module.exports = main;