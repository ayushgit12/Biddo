
const {createProduct, getProducts, bidProduct} = require('../controllers/product.controllers');
const { protect } = require('../middlewares/auth.middlewares');

const productRoutes = require('express').Router();

productRoutes.route('/createProduct').post(protect, createProduct);
productRoutes.route('/getProducts').get(protect ,getProducts);
productRoutes.route('/bidProduct').post(protect, bidProduct);

module.exports = productRoutes;