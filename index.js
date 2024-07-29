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
const server = require("http").createServer(app);
const io = require("socket.io")(server);
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
    systemInstruction: "This is a study bot, made to help people learn and thrive in school, work, and at home studying.\nFor example, this study bot can make summaries of text, explain history, help with homework, and even create a study plan.\nIt starts by telling an on topic joke to keep things enjoyable, revises notes and essays, and can give quizzes one question at a time, and allows the person to answer, then gives feedback and moves on.",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
    var chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [{
      role: "user",
      parts: [{text: "how can you help me?"}],
    }]
    },);
  
  

  io.on("connection", socket=> {
    socket.on("submit", async text=> {
      const result = await chatSession.sendMessage(text);
      socket.emit("return", result.response.text());
    })
    socket.on("audio", async c=> {
      const result = await chatSession.sendMessage(c);
      socket.emit("talk", result.response.text());
    })
    socket.on("chat", hist => {
       chatSession = model.startChat({
        generationConfig,
     // safetySettings: Adjust safety settings
     // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: hist
      });
    })
  })
  server.listen(3000);
