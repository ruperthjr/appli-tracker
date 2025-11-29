const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_KEY,
});

async function main({ query }) {
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