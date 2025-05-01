const express = require('express');
const fs = require('fs');

const app = express();
const port = 3001;

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://whatever:whatever123123123@cluster0.c0e2tij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

var db;
//var database = "sample_mflix";

//connect to db and listen to port
start();
console.log('dffff')
app.post('/api', async function(req, res) {
	console.log('posted')
    res.send('post request');
});
app.get('/api', async function(req, res) {
    console.log('get');
    let result=await findCollection(db,'mflix_sample','movies')
    result=await result.toArray()
    console.log(result)
    res.send('get request');
});
app.put('/api', async function(req, res) {
	console.log('put')
    res.send('put request');
});
app.delete('/api', async function(req, res) {
	console.log('deleted')
    res.send('delete request');
});

async function findCollection(db, database, collection) {
    let result = await db.db(database).collection(collection).find({});
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
