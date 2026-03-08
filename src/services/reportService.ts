import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "stock_bot_mvp";

let client: MongoClient;
let db: Db;

export async function getDatabase(): Promise<Db> {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  }
  return db;
}

export async function getLatestReport() {
  const database = await getDatabase();
  const collection = database.collection('latest_analysis_report');
  
  // Sort by _id descending to get the most recent report
  const report = await collection.find({}).sort({ _id: -1 }).limit(1).toArray();
  return report.length > 0 ? report[0] : null;
}

export async function getTrackedStocks() {
  const database = await getDatabase();
  const collection = database.collection('tracked_stocks');
  return await collection.find({ enabled: true }).toArray();
}
