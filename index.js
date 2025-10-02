const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evlryj7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const dataCollection = client.db("room_finder").collection("find-roommate");

    app.get("/find-roommate", async (req, res) => {
      // const cursor = dataCollection.find();
      // const result = await cursor.toArray();
      const result = await dataCollection.find().toArray();
      res.send(result);
    });

    // done
    app.get("/roomDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(query);
      res.send(result);
    });

    // baki
    app.get("/find-roommate/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await dataCollection.find(query).toArray();
      res.send(result);
    });

    // done
    app.put("/update-data/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: data,
      };
      const result = await dataCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // done
    app.post("/find-roommate", async (req, res) => {
      const newData = req.body;
      console.log(newData);
      const result = await dataCollection.insertOne(newData);
      res.send(result);
    });

    // Baki
    app.delete("/find-roommate-delete/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Room server is ready.");
});

app.listen(port, () => {
  console.log(`Room server is running on port ${port}`);
});
