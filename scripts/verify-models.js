
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Comprehensive list of models to test
    const aliases = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-002',
        'gemini-1.5-pro',
        'gemini-1.5-pro-001',
        'gemini-1.5-pro-002',
        'gemini-pro',
        'gemini-1.0-pro'
    ];

    console.log("Testing Model Availability...");

    for (const name of aliases) {
        try {
            console.log(`Checking ${name}...`);
            const m = genAI.getGenerativeModel({ model: name });
            const result = await m.generateContent("Test");
            console.log(`✅ ${name} IS AVAILABLE`);
        } catch (e) {
            console.log(`❌ ${name} failed: ${e.message ? e.message.substring(0, 100).replace(/\n/g, ' ') : 'Unknown error'}`);
        }
    }
}

listModels();
