
require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is missing from .env.local");
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();

    const result = await client.db().command({ ping: 1 });

    console.log("✅ MongoDB connected successfully!");
    console.log("Ping result:", result.ok);
    console.log("Database:", client.db().databaseName);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

testConnection();
