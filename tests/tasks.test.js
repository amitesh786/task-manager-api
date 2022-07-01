const request = require('supertest')
const app = require('../src/app')

const Task = require('../src/models/tasks')
const { userOne, userOneId, setUpDatabase } = require('./__mocks__/fixtures/db')

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

