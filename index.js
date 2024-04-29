const express= require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port=process.env.PORT ||5000;



const app =express();

// middleware
app.use(express.json())
app.use(cors());
// .env file
// merquireit
// bLLOxvuYH70NVNg4


// /mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uok4zlq.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
    try {

        // const usersCollection = client.db("merquireit").collection("users");
      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();
      // Send a ping to confirm a successful connection
    //   await client.db("admin").command({ ping: 1 });

    const profileCollection = client.db('profileDB').collection('profile');


    app.get('/pro', async (req, res) => {
      const cursor = profileCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })



    // sending data to db
    app.post('/profile', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await profileCollection.insertOne(newProduct);
      res.send(result);
    })


    // pagination
app.get('/itemsCount', async (req, res) => {
    const count = await profileCollection.countDocuments();
    res.send({ count });
  })
  
  app.get('/items', async (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
  
    // console.log('pagination query', page, size);
    const result = await profileCollection.find({ })
    .skip(page * size)
    .limit(size)
    .toArray();
    // console.log(result)
    res.send(result);
  })

      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("server is running")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})