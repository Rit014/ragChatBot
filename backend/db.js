import { MongoClient } from "mongodb";

const dbName = "rag";

let client;
let db;

export async function connectToMongo() {
    if (db) return db;

    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set in .env");

    client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB connected successfully");
    return db;
}

export async function getCollection(collectionName) {
    const database = await connectToMongo();
    return database.collection(collectionName);
}

export async function closeConn() {
    if (client) {
        await client.close();
        client = undefined;
        db = undefined;
    }
}