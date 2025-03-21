const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Form-data


const port = process.env.PORT || 3000;
const uri = new URL("mongodb+srv://tung1872004:vojSzAiKC3AEYBaA@todo.geywg.mongodb.net/?retryWrites=true&w=majority&appName=Todo").toString();

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client.db("todoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    return null;
  }
}

app.use(express.json());

app.get('/', async (req, res) => {
  const db = await connectDB();
  if (db) {
    res.send('Welcome to the To-Do List API');
  } else {
    res.status(500).send('Error connecting to database');
  }
});

const crud = require('./API/crud');
const dependency = require('./API/crud');

app.use('/tasks', crud(client));
app.use('/dependencies', dependency(client));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
