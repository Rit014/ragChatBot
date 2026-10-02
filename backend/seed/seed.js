import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from '@google/genai';
import { closeConn, getCollection } from "../db";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

function flattenInsuranceRecord() {
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
}

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
    `


