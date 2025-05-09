const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
app.use(express.json());
const port = 3001;
const SECRET_KEY = 'HelloThere';

app.use(cors());

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
    let result = await findInCollection('game_articles', 'users', {});
    //let result=await findInCollection("Test","Test-Collection", req.body);
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
    let result = await insertOne('game_articles', 'users', req.body);
    res.send('Added user to database');
});

app.post('/api/users/login', async function(req, res) {
    let user = await findInCollection('game_articles', 'users', req.body);
    
    //if user exists
    if (!user) {
        return res.json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
        { userId: user._id, username: user.username }, // Payload
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({
        message: 'Login successful',
        token: token
    });
})

//get posts 
app.get('/api/posts/:page', async function(req, res) {
    let result = await db.db('game_articles').collection('posts').find({}).skip((parseInt(req.params.page) - 1) * 10).limit(10).toArray();
    res.json(result);
})

//posts CRUD
app.post('/api/posts', async function(req, res) {
    insertOne('game_articles', 'posts', req.body);
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
