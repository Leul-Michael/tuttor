// import type { NextApiRequest, NextApiResponse } from "next"
import mongoose from "mongoose"

// const connectDB =
//   (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
//     if (mongoose.connection.readyState) {
//       return (handler as any)(req, res)
//     }
//     try {
//       await mongoose.connect(process.env.MONGO_URI || "")
//       return (handler as any)(req, res)
//     } catch (e: any) {
//       console.log(e.message)

//       res.json({ msg: "Failed to connect to DB" })
//     }
//   }

// export default connectDB

const MONGO_URL: string = process.env.MONGO_URI || ""

if (!MONGO_URL) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.local"
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    mongoose.set("strictQuery", false)
    cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
