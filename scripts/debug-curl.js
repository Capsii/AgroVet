
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.error("No API Key found in .env.local");
    process.exit(1);
}

console.log("Querying https://generativelanguage.googleapis.com/v1beta/models?key=...");

const fs = require('fs');

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("✅ AVAILABLE MODELS FOUND");
                fs.writeFileSync('models.json', JSON.stringify(json.models, null, 2));
            } else {
                console.log("❌ ERROR RESPONSE");
                fs.writeFileSync('models.json', JSON.stringify(json, null, 2));
            }
        } catch (e) {
            fs.writeFileSync('models_raw.txt', data);
        }
    });
}).on('error', (e) => {
    console.error("Network Error:", e);
});
