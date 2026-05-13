/**
 * Mongoose connection helper.
 *
 * NOTE: This is a scaffold only. No models are imported here yet so that
 * builds succeed without a live MONGODB_URI. When the backend is wired up,
 * add real model definitions under `lib/models/` and import them where used.
 *
 * Usage (later):
 *   import { connectToDatabase } from "@/lib/mongoose";
 *   await connectToDatabase();
 */

import mongoose, { type Mongoose } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

const cached =
  global.__mongoose ?? (global.__mongoose = { conn: null, promise: null });

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local before using the database.",
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB ?? "codepilot",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export type { Mongoose };
