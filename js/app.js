const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://whatever:whatever123123123@cluster0.c0e2tij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.post('/api', (req, res)=> {
	console.log('posted')
    res.send('post request');
})
app.get('/api', (req, res)=> {
	console.log('get')
    res.send('get request');
})
app.put('/api', (req, res)=> {
	console.log('put')
    res.send('put request');
})
app.delete('/api', (req, res)=> {
	console.log('deleted')
    res.send('delete request');
})


//Listen to port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })