const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const storySchema = new Schema({
  title: {
    type: String,
    default: 'Untitled'
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: ObjectId,
    ref: 'User'
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
  score: {
    type: Number,
    default: 1
  },
  narration: String,
  tags: []
}, {
  timestamps: true
});

storySchema.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
