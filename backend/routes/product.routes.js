
const {createProduct, getProducts, bidProduct, bidEnd, refreshBid, getProductById, getUnsoldProducts} = require('../controllers/product.controllers');
const { protect } = require('../middlewares/auth.middlewares');

const productRoutes = require('express').Router();

productRoutes.route('/createProduct').post(protect, createProduct);
productRoutes.route('/getProducts').get(protect ,getProducts);
productRoutes.route('/bidProduct').post(protect, bidProduct);
productRoutes.route('/bidEnd').post(protect, bidEnd);
productRoutes.route('/refreshBid').get(refreshBid);
productRoutes.route('/getProductById/:id').get(protect, getProductById);
productRoutes.route('/getUnsoldProducts').get(protect, getUnsoldProducts);


module.exports = productRoutes;