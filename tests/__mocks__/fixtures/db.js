const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../../src/models/users')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
	_id: userOneId,
	name: 'Singh',
	email: 'amiteshsingh@gmail.com',
	password: 'testing',
	tokens: [{
		token: jwt.sign({_id: userOneId }, process.env.JWT_SECRET)
	}]
};

const setUpDatabase = async () => {
	await User.deleteMany()
	await new User(userOne).save()
}

module.exports = {
	userOne,
	userOneId,
	setUpDatabase
}
