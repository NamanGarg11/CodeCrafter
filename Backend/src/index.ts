require("dotenv").config();
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT, getSystemPrompt } from "./prompt";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

// Initialize Gemini SDK
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

const app = express();
app.use(cors());
app.use(express.json());

// POST /template — Decide between "node" or "react"
app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  const fullPrompt = `
System: Return either node or react based on what do you think this project should be.
Only return a single word: either "node" or "react". Do not return anything else.

User: ${prompt}
`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const answer = response.text().trim().toLowerCase();

  if (answer === "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
    return;
  }

  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });
    return;
  }

  res.status(403).json({ message: "Invalid classification." });
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    // 👇 Combine system + messages into a single prompt
    const fullPrompt =
      `${getSystemPrompt()}\n\n` +
      messages.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: 8000,
      },
    });

    const response = await result.response;

    res.json({ response: response.text() });
  } catch (err) {
    console.error("Gemini error in /chat:", err);
    res.status(500).json({ message: "Gemini API failed", error: err });
  }
});



app.listen(3000, () => {
  console.log("🚀 Gemini API server running on port 3000");
});
