const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     description: {
          type: String,
          required: true,
     },
     currentPrice: {
          type: Number,
          required: true,
     },
     category: {
          type: String,
          required: true,
     },
     productImages: {
          type: Array,
          default: [],
     },
     isBid : {
          type: Boolean,
          required: true,
     },
     isSold: {
          type: Boolean,
          required: true,
     },
     highestBidderId: {
          type: String,
          default: "",
     },
     bidStartTime: {
          type: Date,
     },
}
,
{
     timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;