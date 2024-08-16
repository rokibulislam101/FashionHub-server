const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    'https://66bf81051f582367ddd6f640--sunny-salamander-fd22d2.netlify.app/',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6poe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log('uri');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    console.log('Connected to MongoDB');

    const productCollection = client.db('FashionHub').collection('product');
    const orderCollection = client.db('FashionHub').collection('order');

    // Products APIs
    // Get all products
    app.get('/product', async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products);
    });

    // Get product by ID
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const product = await productCollection.findOne({
          _id: new ObjectId(id),
        });
        if (product) {
          res.send(product);
        } else {
          res.status(404).send({ message: 'Product not found' });
        }
      } catch (error) {
        res.status(400).send({ message: 'Invalid ObjectId' });
      }
    });

    // Orders APIs
    // Get all order
    app.get('/order', async (req, res) => {
      const order = await orderCollection.find().toArray();
      res.send(order);
    });

    // Add a new order
    app.post('/order', async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.send(result);
    });

    // Ping MongoDB
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Fashion Hub server is running');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
