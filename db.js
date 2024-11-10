const mongoose = require('mongoose');
require('dotenv').config();

const DB_USER = process.env.MONGO_DB_USERNAME;
const DB_PASS = process.env.MONGO_DB_PWD;
const mongoUrlDockerCompose = process.env.MONGO_URI_FLIGHT;

// Tùy chọn cấu hình cho kết nối
const mongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Sử dụng singleton pattern để lưu instance của Mongoose connection
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        // Trả về kết nối nếu đã kết nối trước đó
        return mongoose.connection;
    }

    try {
        await mongoose.connect(mongoUrlDockerCompose, mongoClientOptions);
        console.log("Connected to MongoDB!");
        isConnected = true;
        return mongoose.connection;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

module.exports = connectToDatabase;
