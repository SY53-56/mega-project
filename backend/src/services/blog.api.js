const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function codeRun(topic) {
  try {
    const response = await ai.models.generateContent({
      model:  "gemini-3-flash-preview",
      contents: `Write a short blog about ${topic} and answer in paragraph and only 7 to 8 line `,
    });
    console.log("✅ Blog generated successfully");
    return response.text;
  } catch (err) {
    console.error("❌ Error generating blog:", err);
    return null;
  }
}

module.exports = codeRun;