const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.port || 5000


// middlewares
app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = "mongodb+srv://samiamou96:ZKKrUQk7kXdpT0Xo@cluster0.un1xhdi.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const myColl = client.db("usersDB").collection('users');
    app.get('/users', async(req, res) => {
      const cursor = myColl.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:id', async(req,res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query);
      const user = await myColl.findOne(query);
      res.send(user); 
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);

      const result = await myColl.insertOne(user);
      res.send(result);
    })


    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log("please delete this id", id)
      const query = { _id : new ObjectId(id)}
      const result = await myColl.deleteOne(query);
      
      res.send(result);
      
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send(' simple crud is running')
})


app.listen(port, () => {
  console.log(` simple crud is ruuning ${port} `)
})