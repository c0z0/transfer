const { getTransfer } = require('./db')

module.exports = async id => {
	const transfer = await getTransfer(id)

	return transfer
}
