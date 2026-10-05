import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { closeConn, getCollection } from "../db.js";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

function flattenInsuranceRecord(record) {
    const {
        policyNumber,
        name,
        age,
        insuranceType,
        plan,
        premium,
        coverage,
        startDate,
        endDate,
        claims = []
    } = record;

    // converting claim objects into readable text
    const claimText =
        claims.length > 0
            ? claims.map((c, i) =>
                `Claim ${i + 1}: ID ${c.claimId}, Date ${c.date}, Amount ₹${c.amount}, Reason: ${c.reason}, Status: ${c.status}`
            ).join("; ")
            : "No claim history";

    // Concatenate all details into one text string
    return `
        Policy Number: ${policyNumber}.
        Customer Name: ${name}, Age: ${age}.
        Insurance Type: ${insuranceType}.
        Plan: ${plan}.
        Premium: ₹${premium}, Coverage: ₹${coverage}.
        Policy Period: ${startDate} to ${endDate}.
        Claims: ${claimText}.
    `;
}

async function generateAndStoreEmbeddings() {
    try {
        // Read insurance data
        const fileData = fs.readFileSync(
            "./seed/insurance_data.json",
            "utf-8"
        );

        const insuranceArray = JSON.parse(fileData);

        console.log(`Loaded ${insuranceArray.length} insurance records`);

        const documents = [];

        // Generate embeddings
        for (const record of insuranceArray) {
            const textChunk = flattenInsuranceRecord(record);

            const response = await ai.models.embedContent({
                model: "gemini-embedding-001",
                contents: textChunk,
                config: {
                    outputDimensionality: 768
                }
            });

            const embedding = response.embeddings[0].values;

            documents.push({
                text: textChunk.trim(),
                embedding,
                policyNumber: record.policyNumber,
                customerName: record.name,
                insuranceType: record.insuranceType
            });

            console.log(`Generated embedding for ${record.name}`);
        }

        // Connecting to MongoDB
        const collection = await getCollection("insurance_embeddings");

        // Insert all documents in bulk
        if (documents.length > 0) {
            await collection.insertMany(documents);

            console.log(
                `🎯 Inserted ${documents.length} embeddings into MongoDB.`
            );
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await closeConn();
    }
}

generateAndStoreEmbeddings();