const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = mongoose.model('Comment', {
    title: String,
    content: String,
    meta: { votes: Number, favs:  Number }
    time : { type : Date, default: Date.now }
    reviewId: { type: Schema.Types.ObjectId, ref: 'Resource' },
});

module.exports = Comment
