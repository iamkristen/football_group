const mongoose = require('mongoose');
const footbalSchema = require('footballSchema');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017');
}