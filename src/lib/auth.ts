
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const client = new MongoClient(mongoUri);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
