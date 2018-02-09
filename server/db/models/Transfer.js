const mongoose = require('mongoose')
const shortid = require('shortid')

const Transfer = new mongoose.Schema({
  s3Url: String,
  message: String,
  senderName: String,
  fileName: String,
  fileSize: Number,
  _id: {
    type: String,
    default: shortid.generate
  }
})

module.exports = mongoose.model('Transfer', Transfer)
