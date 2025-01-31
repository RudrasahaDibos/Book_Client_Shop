const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())
//dbusers1
//NzoVPsdgFEVmU78C



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.1z9vn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const DB = client.db("BooksDB")
    const BookCollection  = DB.collection('Books');
    const usersCollection  = DB.collection('users');
    app.get('/books',async(req,res)=>{
        const Cursor = BookCollection.find()
        const result = await Cursor.toArray()
        res.send(result)
    })

    app.get('/books/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const reuslt = await BookCollection.findOne(query)
      res.send(reuslt)
    })

   app.put('/books/:id',async(req,res)=>{
    const id = req.params.id
    const updatedbooks = req.body;
    const filter = {_id:new ObjectId(id)}
    const Option ={upsert:true}
    const user ={
      $set:{
        name:updatedbooks.name,
        Edition:updatedbooks.Edition,   
        prize:updatedbooks.prize, 
        Author:updatedbooks.Author,
         Description:updatedbooks.Description,
          image:updatedbooks.image, 
          Sponsor:updatedbooks.Sponsor,
      }
    }
    const result = await BookCollection.updateOne(filter,user,Option)
    res.send(result)
   })

    app.delete('/books/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const book = await BookCollection.deleteOne(query)
      res.send(book)
    })



    app.post('/books',async(req,res)=>{
        const book = req.body;
        console.log(book)
        const result = await BookCollection.insertOne(book)
        res.send(result)
    })



    // userProfilHandle
   app.get('/users',async(req,res)=>{
       const cursor = usersCollection.find()
       const result = await cursor.toArray()
       res.send(result)

   })
   app.patch('/users',async(req,res)=>{
    const email = req.body.email
    const filter = {email}
    const updateDoc ={
     $set:{
      lastSignInTime:req.body?.lastSignInTime
     }
    }
    const reuslt = await usersCollection.updateOne(filter,updateDoc)
    res.send(reuslt)

   })


    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    app.delete('/users/:id',async(req,res)=>{
            const  id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.send(result)
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



app.get('/',(req,res)=>{
    res.send('This is sever site')
})
app.listen(port,() =>{
  console.log(`Example app listening on port ${port}`)
})