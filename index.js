const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://Habit-tracker:ufOk6srAY6jKcfnb@cluster0.4xbagdk.mongodb.net/?appName=Cluster0";

app.use(cors());
app.use(express.json());
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("Habit");
    const habitCollection = db.collection("dailyHabit");

    app.get("/", (req, res) => {
      res.send("from server");
    });
    // Post habit data

    app.post("/habit", async (req, res) => {
      const data = req.body;
      const result = await habitCollection.insertOne(data);
      res.send(result);
    });
    // Get habit data for home

    app.get("/habit", async (req, res) => {
      const result = await habitCollection
        .find()
        .sort({ Created_at: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // Get data for Browse all
    app.get('/browseAll',async(req,res)=>{
      const result=await habitCollection.find().toArray()
      res.send(result)
    })
    // Get data by ID

    app.get("/habit/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await habitCollection.findOne(filter);
      res.send(result);
      console.log(id);
    });
    // Get data by email indivisually

    app.get("/habitByEmail/", async (req, res) => {
      const email = req.query.email;
      const filter = {
        Created_by: email,
      };
      const result = await habitCollection.find(filter).toArray();
      res.send(result);

      console.log(email);
    });

    //
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedData = {
        $set: data,
      };
      const result = await habitCollection.updateOne(filter, updatedData);
      res.send(result);
    });
    // DELETE

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const result = await habitCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`The server running on ${port}`);
});

