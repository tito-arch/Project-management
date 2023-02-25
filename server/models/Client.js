const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name :{
    type: String,
  },
  email :{
    type: String,
  },name :{
    phone: String,
  }
});

module.exports = mongoose.model('Client', ClientSchema);