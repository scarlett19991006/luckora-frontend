require('dotenv').config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());

// Ensure API Key is Loaded
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: Missing OpenAI API Key! Set OPENAI_API_KEY in .env file.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

app.post("/zodiac", async (req, res) => {
    const { birthYear } = req.body;
    
    if (!birthYear) {
        return res.status(400).json({ error: "Birth year is required" });
    }

    try {
        console.log("🚀 Sending Request to OpenAI API...");
        console.log("📥 Request Data:", birthYear);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a Chinese Zodiac fortune teller. Always give **direct responses** without any reasoning."
                },
                {
                    role: "user",
                    content: `Provide a direct response for someone born in **${birthYear}**:
                    - **The Chinese Zodiac:** (Just the name of that Chinese Zodiac)
                    - **Lucky Color of the Year:** (Just the color name) 
                    - **Personality Traits:** (3 concise adjectives)
                    - **Special Fortune of the Year:** (3 sentence includes good things for 2 sentences, and one sentence for some concern. )`
                }
            ],
            max_tokens: 150,
            temperature: 0.5
        });

        const result = response.choices[0]?.message?.content || "No response from AI.";
        console.log("✅ OpenAI API Response:", result);
        res.json({ response: result });

    } catch (error) {
        console.error("❌ API Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
