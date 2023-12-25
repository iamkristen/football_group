const express = require ('express');
const server = express();
const Database = require('./database')
const parser = require('body-parser')
const cors = require('cors');
const appRoutes = require('./router/app_router') 


server.use(parser.json());
server.use(parser.urlencoded({extended:false}))
server.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // if you're using cookies or authentication headers
}));
server.use("/football/",appRoutes);


server.listen(5000,()=>{
    console.log('Server running on Port:5000 ');
})
