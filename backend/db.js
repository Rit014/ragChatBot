import { MongoClient } from 'mongodb';
const uri = process.env.MONGO_URI;
const dbName = "rag";

let client;
let db;

export async function connectToMongo(){
    if(db) return db;

    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB Connected Successfullyy!!! ");
    return db;
}

async function getDb(){
    if(!db) {
        await connectToMongo();
    }
    return db;
}

export async function getCollection(collectionName) {
    const data = await getDb();

    return data.collection(collectionName);
}

export async function closeConn(){
    await db.close();
}