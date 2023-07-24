const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.48shya3.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const usersCollection = client.db("eduDb").collection("college")
    const collegeCollection = client.db("eduDb").collection("collection")

    app.get('/college', async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
    })

    app.get('/allcollege/:id',async(req,res) => {
      const id = req.params.id;
      const query = ({_id : new ObjectId(id)})
      const result = await usersCollection.findOne(query)
      res.send(result)
    })
    app.get('/admission/:id',async(req,res) => {
      const id = req.params.id;
      const query = ({_id : new ObjectId(id)})
      const result = await usersCollection.findOne(query)
      res.send(result)
    })
     app.post("/addcollege",async (req,res) => {
        const body = req.body
        if(!body){
            return res.status(404).send({message: "body data not found"})
        }
        const result = await collegeCollection.insertOne(body)
        res.send(result)
    })

    // app.get("/mycollege",async (req,res) =>{
    //   console.log(req.query.email)
    //   let query = {}
    //   if(req.query?.email){
    //     query = {email: req.query.email}
    //   }
    //   const college = await collegeCollection.find(query).toArray()
    //   res.send(college)
    // })
    app.get('/admitCollage/:email', async (req, res) => {
      const email = req.params.email;
      const result = await collegeCollection.find({ email: email }).toArray();
      res.send(result);
  })
  app.get("/searchcollage/:text", async (req, res) => {
    const text = req.params.text;
    const result = await usersCollection
        .find({
            $or: [
                {
                    collagename: { $regex: text, $options: "i" }
                },

            ],
        })
        .toArray();
    res.send(result);
});
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('Eduhaven is running')
})

app.listen(port,() => {
    console.log(`eduhaven is running on port ${port}`)
})