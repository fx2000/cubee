const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserDiceSchema = new Schema({
    author: {
        type: ObjectId,
        ref: 'User'
    },
    icon: {type:Array, required: true},
    name: String
}, {
    collection: 'userDice'
});

const UserDice = mongoose.model('UserDice', UserDiceSchema);
module.exports = UserDice;
