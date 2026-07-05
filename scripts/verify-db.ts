import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function verify() {
    console.log('Testing MongoDB connection...');
    console.log('URI length:', MONGODB_URI ? MONGODB_URI.length : 0);

    if (!MONGODB_URI) {
        console.error('MONGODB_URI is missing');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Successfully connected to MongoDB!');
        console.log('Database name:', conn.connection.name);
        console.log('Host:', conn.connection.host);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Connection failed!');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.reason) console.error('Reason:', error.reason);
        process.exit(1);
    }
}

verify();
