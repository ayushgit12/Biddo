const Product = require('../models/product.models');

const createProduct = async (req, res) => {

     const { name, description, currentPrice, productImages, category } = req.body;

     
     
     try {
     let product = new Product({
          name,
          description,
          currentPrice,
          category,
          productImages,
          isBid: false,
          isSold: false,
          highestBidderId: "",
          bidStartTime: "",

     });
     await product.save();
     res.status(201).json({ message: "Product created successfully" });
     }
     catch (error) {
          console.error("Error creating product:", error);
          res.status(500).json({ message: "Server error" });
     }
}

const getProductById = async(req, res) => {
     // console.log
     const productId = req.params.id;
     try {
          const product = await Product .findById(productId);
          if (!product) {
               return res.status(404).json({ message: "Product not found" });
          }
          res.json(product);
     }
     catch (error) {
          console.error("Error getting product:", error);

          res.status(500).json({ message: "Server error" });
     }
}

const getUnsoldProducts = async(req, res) => { 
     try {
          const products = await Product.find({ isSold: false });
          res.json(products);
     }
     catch (error) {
          console.error("Error getting products:", error);
          res.status(500).json({ message: "Server error" });
     }
}


const getProducts = async (req, res) => {
     try {
          const products = await Product.find();
          res.json(products);
     }
     catch (error) {
          console.error("Error getting products:", error);
          res.status(500).json({ message: "Server error" });
     }
}

const bidProduct = async (req, res) => {
     const productId = req.body.productId; // Product Id
     
     try {
          const product = await Product.findById(productId);
          if (!product) {
               return res.status(404).json({ message: "Product not found" });
          }
          if (product.isSold) {
               return res.status(400).json({ message: "Product already sold" });
          }

          if(product.bidStartTime + 24*60*60*1000 > Date.now()){
               return res.status(400).json({ message: "Product bidding time expired" });
          }

          // product.currentPrice ==> Offered Price
          if(product.currentPrice > req.body.offeredPrice){
               return res.status(400).json({ message: "Offered price is less than current price" });
          }

          if(product.highestBidderId === req.body.user._id){
               return res.status(400).json({ message: "You are already the highest bidder" });
          }
          product.highestBidderId = req.body.user._id;
          product.currentPrice = req.body.offeredPrice;
          product.bidStartTime = Date.now();
          product.isBid = true;
          await product.save();
          res.json({ message: "Product bidded successfully"
               ,
               product: product
           });
     }
     catch (error) {
          console.error("Error buying product:", error);
          res.status(500).json({ message: "Server error" });
     }
}


const bidEnd = async(req, res) => {
     const productId = req.body.productId; // Product Id
     
     try {
          const product = await Product.findById (productId);
          if (!product) {
               return res.status(404).json({ message: "Product not found" });
          }

          if(product.bidStartTime + 24*60*60*1000 >= Date.now()){
               product.isBid = false;
               product.isSold = true;
               
               await product.save();

               return res.status(400).json(
                    { message: "Product bidding time expired",
                         highestBidder: product.highestBidderId,
                         price: product.currentPrice
                     }


               );
          }
          else{
               return res.status(400).json({ message: "Product bidding time not expired" });
          }

          
          }
     catch (error) {
          console.error("Error buying product:", error);
          res.status(500).json({ message: "Server error" });
     }
}

const refreshBid = async(req, res) => {
     
     
     try {
          const product = await Product.find();
          if (!product) {
               return res.status(404).json({ message: "Product not found" });
          }

          solds = []

          product.forEach(element => {
               if(element.bidStartTime + 24*60*60*1000 >= Date.now()){
                    element.isBid = false;
                    element.isSold = true;
                    solds.push(element);
                    element.save();
               }
          }
          );

          if(solds.length == 0){
               return res.status(400).json({ message: "No product bidding time expired" });
          }
          else{
               return res.status(400).json({ message: "Product bidding time expired",
                    products: solds
                });
          }

          
          }
     catch (error) {

          console.error("Error refreshing:", error);
          res.status(500).json({ message: "Server error" });
     }
}



module.exports = { createProduct, getProducts, bidProduct, bidEnd, refreshBid, getProductById, getUnsoldProducts };
