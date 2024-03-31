const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// To connect with the database
const connectToDatabase = async () => {
    try{
        let mongoResponse = await mongoose.connect('mongodb+srv://qasim:' + process.env.MONGO_ATLAS_PW + '@cluster0.isrsywl.mongodb.net/?retryWrites=true&w=majority');
        if(mongoResponse){
            console.log("congratulations... Db has been connected!");
        }
    }catch{
        console.log('not connected to data base');
    }
};
connectToDatabase();

// To Log requests in the termninal
app.use(morgan('dev'));

// To make a folder publically available
app.use('/uploads',express.static('uploads'));

// To use body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// To allow CORS
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, PATCH, POST, DELETE, GET");
        return res.status(200).json({}); 
    };
    next();
});

// Commands which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// To handle an Error
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next (error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500 );
    res.json({
        message: error.message
    });
});

module.exports = app;