import { MongoClient } from 'mongodb';
import faker from 'faker';

const mongoUrl = process.env.MONGO_URI
const dbName = process.env.DB_NAME

async function connectToMongoDB() {
    const client = new MongoClient(mongoUrl);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        await createCollections(db);
        await insertSampleData(db);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

async function createCollections(db) {
    try {
        await db.createCollection('admin');
        await db.createCollection('user');
        await db.createCollection('dealership');
        await db.createCollection('deal');
        await db.createCollection('cars');
        await db.createCollection('sold_vehicles');
        console.log('Collections created successfully');
    } catch (error) {
        console.error('Error creating collections:', error);
    }
}

async function insertSampleData(db) {
    try {
        await db.collection('admin').insertOne({
            admin_id: 'admin1',
            password: 'adminpassword'
        });

        const userData = [];
        for (let i = 0; i < 5; i++) {
            userData.push({
                user_email: faker.internet.email(),
                user_id: faker.random.uuid(),
                user_location: faker.address.city(),
                user_info: {
                    name: faker.name.findName(),
                    age: faker.random.number({ min: 18, max: 70 }),
                    gender: faker.random.arrayElement(['male', 'female'])
                },
                password: 'userpassword',
                vehicle_info: []
            });
        }
        await db.collection('user').insertMany(userData);

        const dealershipData = [];
        for (let i = 0; i < 3; i++) {
            dealershipData.push({
                dealership_email: faker.internet.email(),
                dealership_id: faker.random.uuid(),
                dealership_name: faker.company.companyName(),
                dealership_location: faker.address.city(),
                password: 'dealershippassword',
                dealership_info: {
                    description: faker.lorem.sentence(),
                    rating: faker.random.number({ min: 1, max: 5 })
                },
                cars: [],
                deals: [],
                sold_vehicles: []
            });
        }
        await db.collection('dealership').insertMany(dealershipData);

        const carData = [];
        for (let i = 0; i < 10; i++) {
            carData.push({
                car_id: faker.random.uuid(),
                type: faker.vehicle.type(),
                name: faker.vehicle.vehicle(),
                model: faker.vehicle.model(),
                car_info: {
                    color: faker.vehicle.color(),
                    price: faker.random.number({ min: 10000, max: 50000 }),
                    mileage: faker.random.number({ min: 1000, max: 50000 })
                }
            });
        }
        await db.collection('cars').insertMany(carData);

        console.log('Sample data inserted successfully');
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
}

connectToMongoDB();
