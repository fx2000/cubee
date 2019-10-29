const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dieSchema = new Schema({
  name: String,
  icon: String,
  tags: []
}, {
  collection: 'dice'
});

const Die = mongoose.model('Die', dieSchema);
module.exports = Die;
