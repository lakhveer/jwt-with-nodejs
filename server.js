const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
require('./routes.js')(app);

const port = process.env.PORT;

const uri = process.env.DB_URL;
mongoose.connection.openUri(uri, (err, res)=>{
    if(err){
        console.log('Mongodb error = ', err);
    }else{
        console.log('Mongodb connected');
    }
});

app.listen(port, ()=> {
    console.log('Server is running PORT ' + port);
});