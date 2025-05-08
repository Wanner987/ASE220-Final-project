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
    let result = insertOne('Test', 'Test-Collection', req.body)
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

//login api

app.post('/api/users', async function(req, res) {
    let result = insertOne('Game_Articles', 'Users', req.body);
    res.send('Added user to database');
});

app.get('/api/:username/:password', async function(req, res) {
    let username = req.params.username;
    let password = req.params.password;

    let result = findInCollection('Game_Articles', 'Users', {
        "username" : `${username}`,
        "password" : `${password}`
    });
    res.json(result);
})

//posts api

app.post('/api/posts', async function(req, res) {
    insertOne('Game_Articles', 'Posts', req.body);
})


//-----------------------------------------------------------------------------------------------
async function findInCollection(database, collection, criteria) {
    console.log(JSON.stringify(criteria));
    let result = await db.db(database).collection(collection).find(criteria).toArray();
    return result;
}

async function insertOne(database, collection, content) {
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
