import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    console.log("✅ Database: fedproject");
    console.log("✅ Cluster: cluster0.glsdppd.mongodb.net");
    
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error(error.message);
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Run the test
testConnection().catch(console.error);
