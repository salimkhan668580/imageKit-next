import mongoose from "mongoose";
const DB_URL = process.env.DB_URL!;

if (!DB_URL) {
  throw new Error("DB_URL is not defined");
}

let catched = global.mongoose;
if (!catched) {
  catched = global.mongoose = {
    conn: null,
    promise: null,
  };
}


export async function dbConnect() {
  if (catched.conn) {
    return catched.conn;
  }
  if (!catched.promise) {
    catched.promise = mongoose.connect(DB_URL).then(()=>mongoose.connection);
  }

  try {
      catched.conn = await catched.promise;
  } catch (error) {
    catched.promise = null;
    throw error;
    
  }

  return catched.conn;
}
