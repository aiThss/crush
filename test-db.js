const mongoose = require("mongoose");

const uri = "mongodb://aiThs456:gen16V6mLJZAkoJJ@ac-gkspgrg-shard-00-00.2nrf0lt.mongodb.net:27017,ac-gkspgrg-shard-00-01.2nrf0lt.mongodb.net:27017,ac-gkspgrg-shard-00-02.2nrf0lt.mongodb.net:27017/vibehub?ssl=true&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
