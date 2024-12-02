const mongoose = require('mongoose');
const DB_NAME="register";
console.log(`\nMONGO DB connection starting...`);

const connectDB = async () => {
     try {
          const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
          console.log(`\nMONGO DB connection made. DB_HOST: ${connectionInstance.connection.host} \n`);
     } catch (error) {
          console.error(error);
          throw error;
     }
}

module.exports = connectDB;