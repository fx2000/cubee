const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserDiceSchema = new Schema({
    author: {
        type: ObjectId,
        ref: 'User'
    },
    icons: {
        type: Array,
        required: true
    },
    diceName: {
        type: String,
        default: 'Untitled'
    }
}, {
    collection: 'userDice'
});

const UserDice = mongoose.model('UserDice', UserDiceSchema);
module.exports = UserDice;