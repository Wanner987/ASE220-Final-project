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


//login api

app.post('/api/users', verifyToken,  async function(req, res) {
    let result = await insertOne('game_articles', 'users', req.body);
    res.send('Added user to database');
});

app.post('/api/users/login', async function(req, res) {
    let users = await findInCollection('game_articles', 'users', req.body);
    const user = users[0];
    
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
app.post('/api/posts', verifyToken, async function(req, res) {
    insertOne('game_articles', 'posts', req.body);
})

app.put('/api/posts/:postID', verifyToken, async function(req, res) {
    const tokenUsername = req.user.username; 
    const postUsers = await findInCollection('game_articles', 'posts', { _id: new ObjectId(req.params.postID) });
    const postUser = postUsers[0];
    
    if(tokenUsername == postUser.user) {
        console.log(req.body);
        updateObject('game_articles', 'posts', req.params.postID, req.body);
    } else{
        console.log('not the same users')
    }
});

app.delete('/api/posts/:postID', verifyToken, async function (req, res) {
    const tokenUsername = req.user.username; 
    const postUsers = await findInCollection('game_articles', 'posts', { _id: new ObjectId(req.params.postID) });
    const postUser = postUsers[0];

    console.log(postUser);
    console.log(tokenUsername);

    if(tokenUsername == postUser.user) {
        let result = await deletePost('game_articles', 'posts', req.params.postID);
    }
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

async function updateObject(database, collection, id, newContent) {
    let result = await db.db(database).collection(collection).updateOne(
        { _id: new ObjectId(id) },
        { $set: newContent }
    );
    console.log('updated id', id)
    return result;
}

async function deletePost(database, collection, id) {
    const result = await db.db(database).collection(collection).deleteOne({ _id: new ObjectId(id) });
    console.log(`Deleted ${result.deletedCount}`);
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

function verifyToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Get token from "Authorization: Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token using your secret key
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // If valid, attach the decoded user info to the request object
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();  // Continue to the next middleware/route handler
    });

}
