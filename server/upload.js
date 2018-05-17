const { send } = require('micro')
const shortid = require('shortid')
const AWS = require('aws-sdk')
const Storage = require('@google-cloud/storage')

const { addTransfer } = require('./db')

AWS.config.update({
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const uploadFile = file =>
	new Promise((resolve, reject) => {
		const { name, data, mimetype } = file

		const fileName = shortid.generate() + shortid.generate() + '/' + name
		const s3 = new AWS.S3()
		s3.upload(
			{
				Bucket: process.env.BUCKET,
				Key: fileName,
				Body: data,
				ACL: 'public-read'
			},
			function(err, data) {
				if (err) return reject(err)
				resolve(data.Location)
			}
		)
	})

module.exports = async (req, res) => {
	const { sendTo, message, senderName, fileSize } = req.body

	if (!req.files) return send(res, 400, 'No files uploaded')
	if (!req.files.file) return send(res, 400, 'No files uploaded')
	try {
		const s3Url = await uploadFile(req.files.file)

		const transfer = await addTransfer({
			message,
			s3Url,
			senderName,
			fileName: req.files.file.name,
			fileSize
		})

		console.log(req.files.file)

		send(res, 200, transfer)
	} catch (e) {
		console.log(e)
		send(res, 500, 'Upload failed')
	}
}
