
const {createProduct, getProducts, bidProduct, bidEnd, refreshBid} = require('../controllers/product.controllers');
const { protect } = require('../middlewares/auth.middlewares');

const productRoutes = require('express').Router();

productRoutes.route('/createProduct').post(protect, createProduct);
productRoutes.route('/getProducts').get(protect ,getProducts);
productRoutes.route('/bidProduct').post(protect, bidProduct);
productRoutes.route('/bidEnd').post(protect, bidEnd);
productRoutes.route('/refreshBid').get(refreshBid);

module.exports = productRoutes;