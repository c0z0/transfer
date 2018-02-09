const { upload, move } = require('micro-upload')
const { send } = require('micro')
const match = require('micro-route/match')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
if (dev) require('dotenv').config()

const resolveUpload = require('./upload')
const resolveTransfer = require('./transfer')

const app = next({ dev })
const handle = app.getRequestHandler()

const isUpload = req => match(req, '/up', ['POST'])
const isTransferFront = req => match(req, '/t/:id', ['GET'])

const main = upload(async (req, res) => {
	if (isUpload(req)) {
		return await resolveUpload(req, res)
	}
	if (isTransferFront(req)) {
		const { params: { id } } = isTransferFront(req)
		const transfer = await resolveTransfer(id)
		if (!transfer) app.render404(req, res)
		return app.render(
			req,
			res,
			'/transfer',
			JSON.parse(JSON.stringify(transfer))
		)
	}
	handle(req, res)
})

async function setup(handler) {
	await app.prepare()
	return handler
}

module.exports = setup(main)
