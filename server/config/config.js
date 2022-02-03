const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require("dotenv").config();
let isConnected;
let URI = process.env.MONGODB_URI
const connectToDatabase = () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose.connect(URI,{useNewUrlParser: true})
    .then(db => { 
      isConnected = db.connections[0].readyState;
    });
};
module.exports = {connectToDatabase}