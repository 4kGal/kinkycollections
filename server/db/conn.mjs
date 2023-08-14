import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGO_URI)

let conn
try {
  conn = await client.connect()
} catch (e) {
  console.error(e)
}

let db = conn.db(process.env.MONGO_DATABASE)

export default db
