const express = require ('express');
const server = express();
const mongoose = require('mongoose');
const index = require('./index')
const footbalSchema = require('./football_schema');


server.get("/",(req,res)=>{
    res.send("Hello world");
})

server.listen(5000,()=>{
    console.log('Server running on Port:5000 ');
})
