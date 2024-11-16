// app.js
let express = require('express');
let path = require('path');
let fs = require('fs');
let bodyParser = require('body-parser');
let connectToDatabase = require('./db'); // Import file db.js
let app = express();
const receiveQueue = require('./queue/consumer');
const note = require("./routes/Note.route")
const cors = require('cors');
const verifyToken= require('@hieuga678902003/verifytoken')

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS for all routes with full access
app.use(bodyParser.json());
app.use("/",note)

app.listen(3002, function () {
    console.log("App listening on port 3002!");
});

async function startServer() {
    try {
        const db = await connectToDatabase();
        await receiveQueue()
        // Ví dụ log ra tên collection để xác nhận kết nối thành công
        // console.log(`Connected to collection: ${collection.collectionName}`);
        console.log("hello loc hoang")
        // Thực hiện các thao tác khác với DB nếu cần
    } catch (error) {
        console.error("Could not start server due to database connection error:", error);
    }
}

startServer();
