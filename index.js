const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;



const app = express();

// middleware
app.use(express.json())
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uok4zlq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get("/", (req, res) => {
  res.send("server is running")
})

async function run() {

  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const profileCollection = client.db('profileDB').collection('profile');


    app.get('/profile', async (req, res) => {
      const cursor = profileCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })



    // sending data to db
    app.post('/profile', async (req, res) => {
      const newProfile = req.body;
      console.log(newProfile);
      const result = await profileCollection.insertOne(newProfile);
      res.send(result);
    })

// update

app.get("/updateItem/:id",async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    const query={_id:new ObjectId(id)}
    const result=await profileCollection.findOne(query);
    console.log("update",result)
    res.send(result)
})
    app.patch('/profile/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedItem = req.body;

      const profile = {
        $set: {

 
           fname : updatedItem.fname,
           lname : updatedItem.lname,
           email : updatedItem.email,
           country : updatedItem.country,
           address : updatedItem.address,
           company : updatedItem.city,
           age : updatedItem.region,
           phone : updatedItem.code,
          
          
        }
      }

      const result = await profileCollection.updateOne(filter, profile, options);
      console.log(result);
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








app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})