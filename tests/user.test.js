const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const app = require('../src/app')
const User = require('../src/models/users')

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

beforeEach(async () => {
	await User.deleteMany()
	await new User(userOne).save()
})

test('Should signup a new user', async () => {
	const response = await request(app).post('/users').send({
		name: 'Amitesh',
		email: 'amiteshsingh091018ece@gmail.com',
		password: 'testing'
	}).expect(201)

	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	expect(response.body).toMatchObject({
		user: {
			name: 'Amitesh',
			email: 'amiteshsingh091018ece@gmail.com'
		},
		token: user.tokens[0].token
	})
	expect(user.password).not.toBe('testing')
	expect(response.body.user.name).toBe('Amitesh')
})
 
test('Should login existing user', async() => {
	const response = await request(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)
	
	const user = await User.findById(userOneId)
	expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async() => {
	await request(app).post('/users/login').send({
		email: userOne.email,
		password: 'testing'
	}).expect(400)
})

test('Should get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
})

test('Should get profile for unauthenticated user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401)
})

test('Should delete account for user', async () => {
	const response = await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	
	const user = await User.findById(userOneId)
	expect(user).toBeNull()

})

test('Should delete account for unauthenticated user', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401)
})

