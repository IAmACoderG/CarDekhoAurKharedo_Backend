import express from 'express';
import { MongoClient } from 'mongodb';
import faker from 'faker';

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

// Connect to MongoDB
const connectToMongoDB = async () => {
    const client = new MongoClient(mongoUrl);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes for Admin
app.get('/admin', async (req, res) => {
    const db = await connectToMongoDB();
    const admin = await db.collection('admin').find().toArray();
    res.json(admin);
});

// Routes for User
app.get('/user', async (req, res) => {
    const db = await connectToMongoDB();
    const user = await db.collection('user').find().toArray();
    res.json(user);
});

// Routes for Dealership
app.get('/dealership', async (req, res) => {
    const db = await connectToMongoDB();
    const dealership = await db.collection('dealership').find().toArray();
    res.json(dealership);
});

// Routes for Deal
app.get('/deal', async (req, res) => {
    const db = await connectToMongoDB();
    const deal = await db.collection('deal').find().toArray();
    res.json(deal);
});

// Routes for Cars
app.get('/cars', async (req, res) => {
    const db = await connectToMongoDB();
    const cars = await db.collection('cars').find().toArray();
    res.json(cars);
});

// Routes for Sold Vehicles
app.get('/sold_vehicles', async (req, res) => {
    const db = await connectToMongoDB();
    const soldVehicles = await db.collection('sold_vehicles').find().toArray();
    res.json(soldVehicles);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
