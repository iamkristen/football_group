const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery',true)
  await mongoose.connect('mongodb://0.0.0.0:27017/football').then(()=>console.log("Database connected")).catch((err)=> console.log(err));
}