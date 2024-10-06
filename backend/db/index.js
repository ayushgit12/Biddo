const mongoose = require('mongoose');





console.log(`\nMONGO DB connection starting...`);

const connectDB = async () => {
     try {
          const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
          console.log(`\nMONGO DB connection made. DB_HOST: ${connectionInstance.connection.host} \n`);
     } catch (error) {
          console.error(error);
          

          throw error;

     }
}

module.exports = connectDB;