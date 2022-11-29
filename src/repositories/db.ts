import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.mongoUri || 'mongodb://localhost:27017'

export const client = new MongoClient(mongoUri)

export async function runDb() {
  try {
    await client.connect()
    await client.db('blogs').command({ ping: 1 })
    console.log('Connected successfully to server')
  } catch {
    console.log('Can`t connect to db')
    await client.close()
  }
}
