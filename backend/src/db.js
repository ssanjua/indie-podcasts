const mongoose = require ('mongoose')
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
  } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1); 
  }
};


module.exports = connectDB