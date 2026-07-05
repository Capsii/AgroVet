
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking Key:", key ? "Present (" + key.substring(0, 10) + "...)" : "Missing");

    if (!key) {
        console.error("Error: GEMINI_API_KEY is missing in .env.local");
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        // Use the same model as the app
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        console.log("Sending test prompt...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("Success! Gemini responded:", text.substring(0, 50) + "...");
    } catch (error) {
        console.error("Gemini API Verification Failed:");
        console.error(error.message);
        process.exit(1);
    }
}

testGemini();
