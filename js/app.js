const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
const port = 3001;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://andrewst8:password123123@cluster0.4yg95y3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverApi: ServerApiVersion.v1 });

var db;

//connect to db and listen to port
start();

app.post('/api', async function(req, res) {
	console.log('post');
    let result = InsertOne('Test', 'Test-Collection', req.body)
    res.json(result);
});

app.get('/api', async function(req, res) {
    let result=await findInCollection("Test","Test-Collection", req.body);
    res.json(result);
});

app.put('/api', async function(req, res) {
	console.log('put');
    res.send('put request new');
});

app.delete('/api', async function(req, res) {
	console.log('deleted');
    res.send('delete request');
});

//-----------------------------------------------------------------------------------------------
async function findInCollection(database, collection, criteria) {
    console.log(JSON.stringify(criteria));
    let result = await db.db(database).collection(collection).find(criteria).toArray();
    return result;
}

async function InsertOne(database, collection, content) {
    let result = await db.db(database).collection(collection).insertOne(content);
    console.log("Inserted quote with id:", result.insertedId);
    return findInCollection(database, collection, content);
}

async function connectToMongo() {
    let connection = await client.connect();
    return connection;
}

async function start() {
    db = await connectToMongo();
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      });
}
