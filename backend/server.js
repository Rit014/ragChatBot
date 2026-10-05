import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import { getCollection, connectToMongo } from './db.js';
import { GoogleGenAI } from "@google/genai";


connectToMongo();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

function buildAggragationPipeline(queryEmbedding) {
    return [
        {
            $vectorSearch: {
                queryVector: queryEmbedding,
                path: "embedding",
                numCandidates: 100,
                limit: 10,
                index: "vector_index_test",
            },
        },
        {
            $project: {
                text: 1,
                score: { $meta: "vectorSearchScore" },
            },
        },
    ]
}

async function getAnswerFromLLM(query, context) {
    const maxAttempts = 4;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: `Context:\n${context}\n\nQuestion: ${query}`,
                config: {
                    systemInstruction:
                        "You are a helpful assistant that answers questions based only on the provided context.",
                },
            });
            return response.text;
        } catch (error) {
            if (error.status === 503 && attempt < maxAttempts) {
                console.log(`Model busy, retrying (${attempt}/${maxAttempts - 1})...`);
                await new Promise((r) => setTimeout(r, attempt * 2000));
            } else {
                throw error;
            }
        }
    }
}

app.post("/ask", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {

        const queryEmbedding = await getEmbeddings(query);
        const collection = await getCollection('insurance_embeddings');
        const pipeline = buildAggragationPipeline(queryEmbedding);
        const results = await collection.aggregate(pipeline).toArray();
        if (results.length === 0) {
            return res.json({ answer: "No relevant information found." });
        }

        const context = results.map((r) => r.text).join("\n\n");
        const answer = await getAnswerFromLLM(query, context);
        res.json({ answer });
    }
    catch (error) {
        console.error(" Error:", error);
        res.status(500).json({ error: error.message });
    }
})

async function getEmbeddings(query) {
    const embeddingResponse = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: query,
        config: {
            outputDimensionality: 768
        }
    });

    const queryEmbedding = embeddingResponse.embeddings[0].values;
    return queryEmbedding || [];
}


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});