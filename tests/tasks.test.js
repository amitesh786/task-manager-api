const request = require('supertest')
const app = require('../src/app')

const Task = require('../src/models/tasks')
const { 
	userOne,
	userOneId,
	setUpDatabase,
	userTwo,
	userTwoId,
	taskOne,
	taskTwo,
	taskThree
} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should create task for users', async () => {
	const response = await request(app)
		.post('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: 'From testing my test'
		})
		.expect(200)
	
	const task = await Task.findBtId(response.body._id)
	expect(task).not.toBeNull()
	expect(task.completed).toEqual(false)
})

test('Should get all task for users', async () => {
	const response = await request(app)
		.get('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	expect(response.body.length).toEqual(2)
})

test('Should get all task for users', async () => {
	const response = await request(app)
		.get('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks', async () => {
	const response = await request(app)
		.delete(`/tasks/${taskOne_id}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404)
	const task = await Task.findById(taskOne._id)
	expect(task).not.toBeNull()
})

