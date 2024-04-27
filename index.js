import express from 'express';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import faker from 'faker';

const app = express();
const port = 3000;

const mongoUrl = process.env.MONGO_URI
const dbName = process.env.DB_NAME

const jwtSecret = 'your_secret_key';
const saltRounds = 10;

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

// Admin authentication logic
app.post('/admin/login', async (req, res) => {
    const { admin_id, password } = req.body;

    const db = await connectToMongoDB();
    const admin = await db.collection('admin').findOne({ admin_id });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ admin_id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Token not provided' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        req.admin_id = decoded.admin_id;
        next();
    });
};

// Protected Admin endpoint
app.get('/admin/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected admin endpoint accessed successfully' });
});

// Sample data generation endpoint
app.get('/generate-data', async (req, res) => {
    const db = await connectToMongoDB();

    // Generate sample data for admin
    const adminData = {
        admin_id: 'admin1',
        password: bcrypt.hashSync('adminpassword', saltRounds)
    };
    await db.collection('admin').insertOne(adminData);

    // Generate sample data for users
    const userData = [];
    for (let i = 0; i < 5; i++) {
        const user = {
            user_email: faker.internet.email(),
            password: bcrypt.hashSync('userpassword', saltRounds)
        };
        userData.push(user);
    }
    await db.collection('user').insertMany(userData);

    // Generate sample data for dealerships
    const dealershipData = [];
    for (let i = 0; i < 3; i++) {
        const dealership = {
            dealership_email: faker.internet.email(),
            password: bcrypt.hashSync('dealershippassword', saltRounds)
        };
        dealershipData.push(dealership);
    }
    await db.collection('dealership').insertMany(dealershipData);

    res.json({ message: 'Sample data generated successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
