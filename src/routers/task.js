const express = require('express')
const auth = require('../middleware/auth')
const { Tasks } = require('../models/tasks')
const router = new express.Router()

// router.post('/tasks', async (req, res) => {

// 	const tasks = new Tasks(req.body)

// 	try {
// 		await tasks.save()
// 		res.status(201).send(tasks)
// 	} catch(e) {
// 		res.status(400).send(e)
// 	}
// })

router.post('/tasks', auth, async (req, res) => {

	// const tasks = new Tasks(req.body)
	const task = new Tasks({
		...req.body,
		owner: req.user._id
	})

	console.log(task)
	try {
		await task.save()
		res.status(201).send(task)
	} catch(e) {
		res.status(400).send(e)
	}
})

// router.get('/tasks', async (req, res) => {

// 	try {
// 		const tasks = await Tasks.find({})
// 		res.send(tasks)
// 	} catch(e) {
// 		res.status(500).send(e)
// 	}
// })

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc _asc 1 :desc -1
router.get('/tasks', auth, async (req, res) => {
	const match = {};
	const sort = {};

	if (req.query.completed) {
		match.completed = req.query.completed === 'true'
	}

	if (req.query.sortBy) {
		const portion = req.query.sortBy.split(':');
		sort[portion[0]] = portion[1] === 'desc' ? -1 : -1
	}

	try {
		// const tasks = await Tasks.find({})
		// const tasks = await Tasks.find({ owner: req.user._id})
		// res.send(tasks)

		await req.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.skip),
				sort
			}
		}).execPopulate()
		res.send(req.user.tasks)
	} catch(e) {
		res.status(500).send(e)
	}
})

// router.get('/tasks/:id', async (req, res) => {

// 	const _id = req.params.id

// 	try {
// 		const tasks = await Tasks.findById({_id})
// 		if (!tasks) {
// 			return res.status(404).send()
// 		}
// 		res.send(tasks)

// 	} catch(e) {
// 		res.status(500).send(e)
// 	}
// })

router.get('/tasks/:id', auth, async (req, res) => {

	const _id = req.params.id

	try {
		// const tasks = await Tasks.findById({_id})

		const tasks = await Tasks.findOne( { _id, owner: req.user._id })

		if (!tasks) {
			return res.status(404).send()
		}
		res.send(tasks)

	} catch(e) {
		res.status(500).send(e)
	}
})


// router.patch('/tasks/:id', async (req, res) => {
// 	const updates = Object.keys(req.body)
// 	const allowedUpdates = ['description', 'completed']
// 	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

// 	if(!isValidOperation) {
// 		return res.status(400).send({'error': 'Invalid updates!'})
// 	}

// 	try {

// 		const tasks = await Tasks.findById(req.params.id)

// 		updates.forEach((update) => user[update] = req.body[update])

// 		await tasks.save()

// 		// const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, { 'new': true, 'runValidators': true})

// 		if(!tasks) {
// 			res.status(404).send()
// 		}

// 		res.send(tasks)
// 	} catch(e) {   
// 		res.status(400).send(e)
// 	}
// })

router.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['description', 'completed']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if(!isValidOperation) {
		return res.status(400).send({'error': 'Invalid updates!'})
	}

	try {

		// const tasks = await Tasks.findById(req.params.id)
		const tasks = await Tasks.findOne( { _id: req.params.id, owner: req.user._id})
		
		if(!tasks) {
			res.status(404).send()
		}

		updates.forEach((update) => user[update] = req.body[update])
		await tasks.save()

		// const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, { 'new': true, 'runValidators': true})

		res.send(tasks)
	} catch(e) {   
		res.status(400).send(e)
	}
})

// router.delete('/tasks/:id', async (req, res) => {

// 	try {
// 		const tasks = await Tasks.findByIdAndDelete(req.params.id)

// 		if (!tasks) {
// 			res.status(404).send()
// 		}

// 		res.send(tasks)
// 	} catch(e) {
// 		res.status(500).send(e)
// 	}

// })

router.delete('/tasks/:id', auth, async (req, res) => {

	try {
		// const tasks = await Tasks.findByIdAndDelete(req.params.id)
		const tasks = await Tasks.findOneAndDelete( { _id: req.params.id, owner: req.user._id })

		if (!tasks) {
			res.status(404).send()
		}

		res.send(tasks)
	} catch(e) {
		res.status(500).send(e)
	}
})

module.exports = router
