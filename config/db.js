const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB Memory Server Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
