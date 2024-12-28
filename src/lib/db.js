import "server-only"
import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.DB_URI) {
  throw new Error("Mongo URI not found!");
}

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getDB(dbNme) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log(">>>>>>>> Connected to the DB <<<<<<<<");

    // Send a ping to confirm a successful connection
    return client.db(dbNme);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getCollection(collectionName){
    const db = await getDB("next-app");
    if(db) return db.collection(collectionName);
    return null;
}