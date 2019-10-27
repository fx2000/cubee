const Schema = mongoose.Schema:

const storySchema = new Schema({
  title: String,
  story: String,
  author: {
    type: ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: new Date()
  },
  restricted: bool,
  private: bool,
  votes: [],
  comments: []
})

const Story = mongoose.model('Story', storySchema);
module.exports = Story;