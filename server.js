const express = require ('express');
const server = express();
const mongoose = require('mongoose');
const footbalSchema = require('footballSchema');

server.listen(5000,()=>{
    console.log('Server running on Port:5000 ');
})


