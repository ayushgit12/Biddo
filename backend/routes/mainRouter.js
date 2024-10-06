const express = require('express');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');


const mainRouter = express.Router();

mainRouter.use('/users', userRoutes);
mainRouter.use('/products', productRoutes);



module.exports = mainRouter;