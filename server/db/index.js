const mongoose = require('mongoose')

const Transfer = require('./models/Transfer')

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log('Connected to MongoDB'),
  err => {
    throw err
  }
)

const addTransfer = async ({
  message,
  s3Url,
  fileName,
  senderName,
  fileSize
}) => await Transfer.create({ message, s3Url, fileName, senderName, fileSize })

const getTransfer = async id => await Transfer.findById(id)

module.exports = { addTransfer, getTransfer }
