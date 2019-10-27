const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const storySchema = new Schema({
  title: {
    type: String,
    default: 'Untitled'
  },
  story: {
    type: String,
    required: true
  },
  author: {
    type: ObjectId,
    ref: "User"
  },
  restricted: {
    type: Boolean,
    default: false
  },
  private: {
    type: Boolean,
    default: false
  },
  votes: [],
  comments: [],
  narration: String
}, {
  timestamps: true
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;