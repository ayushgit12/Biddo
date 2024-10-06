
const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const { urlencoded } = require('express');
const cors = require('cors');
const mainRouter = require('./routes/mainRouter');


dotenv.config();
connectDB()
.then(() => {
     console.log(`\nMONGO DB connection made. \n`);
     const app = express();
     const PORT = process.env.PORT || 3000;


     app.get('/', (req, res) => {
          res.send('Hello World');
     })

     
     app.use(express.json({
          limit: '16kb'
        }));

        app.use(cors({
          origin: "*",
          credentials: true
        }));
     
     app.use(urlencoded({extends:true, limit: '16kb'})); 
     
     app.use('/api', mainRouter);
        

     app.on('error', (error) => { 
          console.log(`Error occurred: ${error}`)
          throw error
     })

     app.listen(PORT, () => {
          console.log(`Server is running on PORT: ${PORT}`);
     });
}
)
.catch((error) => {
     console.error(error);
     process.exit(1);
})




