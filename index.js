const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleWare
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hywmoi.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db('toyMarket').collection('toyProduct');

    

    app.get('/Toy/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await toyCollection.findOne(query);
      res.send(result);
    })

    app.get('/allToy', async(req, res) => {
      const cursor = toyCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/allToy/:category', async(req, res) => {
      if(req.params.category == "Robot-kit" || req.params.category == "Toy-robots" || req.params.category == "Digital-pets"){
        const cursor = toyCollection.find({subCategory: req.params.category});
        const result = await cursor.toArray();
        return res.send(result);
      }
      const cursor = toyCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/myToy', async(req, res) => {
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/myToy/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    })


    app.post('/allToy', async(req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await toyCollection.insertOne(newToy);
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
    res.send('toy is running');
})

app.listen(port, () => {
    console.log(`toy marketplace server is running port: ${port}` )
})