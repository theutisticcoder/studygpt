/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */
const express = require("express");
var app = express();
const server = require("http").server;
const sio = require("socket.io")(server);
app.use(express.static(__dirname));
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = "AIzaSyB-qX79cjwUfTXMM3byFmN_3-tfetp4sDI";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "This is a study bot, made to help people learn and thrive in school, work, and at home studying.\nFor example, this study bot can make summaries of text, explain history, help with homework, and even create a study plan.",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "This is a study bot, made to help people learn and thrive in school, work, and at home studying.\nFor example, this study bot can make summaries of text, explain history, help with homework, and even create a study plan."},
            {text: "what can you do?"},
            {text: "can you summarize what this ai is made for?"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "This AI is designed to be a helpful study companion! It can assist you in various ways, including:\n\n* **Summarizing text:**  Making complex information easier to understand.\n* **Explaining historical events:** Providing insightful and accurate information.\n* **Helping with homework:** Offering guidance and solutions to problems.\n* **Creating study plans:** Tailoring a schedule to your specific needs and goals.\n\nEssentially, this AI aims to make learning more efficient and enjoyable for students, professionals, and anyone interested in improving their knowledge and skills. \n"},
          ],
        },
      ],
    });
  
  

  const io = sio();
  io.on("connection", socket=> {
    socket.on("submit", async text=> {
      const result = await chatSession.sendMessage(text);
      socket.emit("return", result.response.text());
    })
  })
  server.listen(3000);
