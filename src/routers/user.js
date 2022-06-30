const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const { User } = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router()

const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		sendWelcomeEmail(user.email, user.name)

		const token = await user.generateAuthToken()
		
		res.status(201).send({user, token})
	} catch(e) {
		res.status(400).send(e)
	}
})

router.post('/users/login', async (req, res) => {
	try {

		console.log(req.body)
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()

		res.send({ user, token})

	} catch (e) {
		console.log(e)
		res.status(400).send(e)
	}
})

router.post('/users/logout', auth, async (req, res) => {
	try {

		// req.user.map( (el)=> {

		// 	el.tokens = el.tokens.filter((token) => {
		// 		console.log(token)

		// 		return token.token !== req.token
		// 	})
		// })

		req.user[0].tokens = req.user[0].tokens.filter((token) => {
			console.log(token)

			return token.token !== req.token
		})
		
		await req.user.save()

		res.send()
	} catch(e) {
		res.status(500).send()
	}
})

router.post('/users/logoutAll', auth, async(req, res) => {
	try {

		req.user.tokens = []
		// req.user.map( (el)=> {

		// 	el.tokens = []
		// })

		await req.user.save()
		res.send()
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
	// try {
	// 	const users = await User.find({})
	// 	res.send(req.user)
	// } catch(e) {
	// 	res.status(500).send(e)
	// }
})

// router.get('/users/:id', async (req, res) => {
// 	const _id = req.params.id
// 	try{
// 		const users = await User.findById({_id})
// 		if (!users) {
// 			return res.status(404).send()
// 		}
// 		res.send(users)
// 	} catch(e) {
// 		res.status(500).send(e)
// 	}
// })

router.patch('/users/:id', async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['name', 'email', 'password', 'age']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if(!isValidOperation) {
		return res.status(400).send({'error': 'Invalid updates!'})
	}

	try {
		const user = await User.findById(req.params.id)

		updates.forEach((update) => user[update] = req.body[update])

		await user.save()

		// const user = await User.findByIdAndUpdate(req.params.id, req.body, { 'new': true, 'runValidators': true})

		if(!user) {
			res.status(404).send()
		}

		res.send(user)
	} catch(e) {   
		res.status(400).send(e)
	}
})

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['name', 'email', 'password', 'age']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if(!isValidOperation) {
		return res.status(400).send({'error': 'Invalid updates!'})
	}

	try {
		// const user = await User.findById(req.params.id)
		// updates.forEach((update) => user[update] = req.body[update])
		// await user.save()

		updates.forEach((update) => req.user[update] = req.body[update])
		await req.user.save()
		
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, { 'new': true, 'runValidators': true})

		// if(!user) {
		// 	res.status(404).send()
		// }

		res.send(user)
	} catch(e) {   
		res.status(400).send(e)
	}
})

router.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id)

		if (!user) {
			res.status(404).send()
		}
		res.send(user)
	} catch(e) {
		res.status(500).send(e)
	}
})

router.delete('/users/me', auth, async (req, res) => {
	try {
		// const user = await User.findByIdAndDelete(req.user._id)
		// if (!user) {
		// 	res.status(404).send()
		// }
		await req.user.remove()
		sendCancelEmail(req.user.email, req.user.name)
		
		res.send(req.user)
	} catch(e) {
		res.status(500).send(e)
	}
})

const upload = multer({
	// dest: 'avatars',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {  
		if (!file.originalname.match(/\.{jpg|jpeg|png}$/) ) {
			return cb(new Error('Please upload an image'))
		}
		cb(undefined, true)
	}
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	
	const buffer = await sharp(res.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
	req.user.avatar = buffer
	await req.user.save()
	
	res.send()
}, (error, req, res, next) => {
	res.status(400).send( { error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
	// req.user.avatar = res.file.buffer
	req.user.avatar = undefined
	await req.user.save()
	
	res.send()
}, (error, req, res, next) => {
	res.status(400).send( { error: error.message })
})

router.get('/users/:id/avatar', auth, async (req, res) => {

	try {
		const user = await User.findById(res.params.id)

		if (!user || !user.avatar) {
			throw new Error()
		}

		res.set('Content-Type', 'image/png')
		res.send(user.avatar)

	} catch(e) {
		res.status(400).send()
	}
}, (error, req, res, next) => {
	res.status(400).send( { error: error.message })
})


module.exports = router
