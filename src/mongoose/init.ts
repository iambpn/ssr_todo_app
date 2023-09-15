import mongoose from "mongoose";

export async function initMongoose(url: string) {
  await mongoose.connect(url);
}
