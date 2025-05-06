const express = require('express');
const fs = require('fs');

const app = express();
const port = 3001;

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://whatever:whatever123123123@cluster0.c0e2tij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverApi: ServerApiVersion.v1 });

var db;
//var database = "sample_mflix";

//connect to db and listen to port
start();

app.post('/api', async function(req, res) {
	console.log('HEY THERE')
    let result=await findCollection('mflix_sample','movies', req.body);
    result=await result.toArray();
    res.json(result);
});

app.get('/api', async function(req, res) {
    console.log('HI GET');
    let result=await findCollection('mflix_sample','movies', req.body);
    try {
        const movies = await client.db("sample_mflix").collection("movies").insertOne({}).sort({year:1}).skip(4).limit(2).toArray();
        
        res.send("movies")
      } catch (error) {
        console.error('Error fetching user:', error);
        res.send('Connection error')
      } finally {
        client.close();
    }
    result=await result.toArray();
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
async function findCollection(database, collection, criteria) {
    console.log(criteria);
    let result = await db.db(database).collection(collection).find(criteria);
    return result;
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
