const express = require('express')
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs')

// load database
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
// const port = process.env.PORT || 3200
const port = process.env.PORT

// const multer = require('multer')
// const upload = multer({
// 	dest: 'img',
// 	limits: {
// 		fileSize: 1000000
// 	},
// 	fileFilter(req, file, cb) {
// 		// if (!file.originalname.endsWith('.pdf')) {
// 		// 	return cb(new Error('PLease upload a PDF'))
// 		// }
// 		if (!file.originalname.match(/\.{doc|docx}$/)) {
// 			return cb(new Error('PLease upload a word document'))
// 		}
// 		cb(undefined, true)
// 	}
// })

// const errorMiddleware = (req, res, next) => {
// 	throw new Error('From my middleware')
// }

// app.post('/upload', upload.single('upload'), (req, res) => {
// 	res.send()
// }, (error, req, res, next) => {
// 	res.status(400).send({ error: error.message })
// })

// app.use( (req, res, next) => {

	// if (req.method === 'GET') {
	// 	res.send('GET request are working...!!!!')
	// } else {
	// 	next()
	// }	
// })

// app.use( (req, res, next) => {
// 	res.status(503).send('Still in process..!!!')
// })

// body parser 
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
	console.log('Server is running on port ' + port)
})


// const myFunction = async () => {
// 	const password = 'Red111111!123'
// 	const hashedPassword = await bcrypt.hash(password, 8)

// 	console.log(password)
// 	console.log(hashedPassword)

// 	const isMatch = await bcrypt.compare(password, hashedPassword)
// 	console.log(isMatch)

// }

// myFunction()

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
// 	const token = jwt.sign({ _id : '123ab' }, 'course', { expiresIn : '2 second'})
// 	console.log(token)

// 	const verify = jwt.verify(token, 'course')
// 	console.log(verify)
// }

// myFunction()

// const { Tasks } = require('./models/tasks')
// const { User } = require('./models/users')

// const main = async () => {
// 	// const task = await Tasks.findById('620cac0e22df9cf61a0ea474')
// 	// await task.populate('owner').execPopulate()
// 	// console.log(task)

// 	const user = await User.findById('620cac0e22df9cf61a0ea474')
// 	await user.populate('tasks').execPopulate()
// 	console.log(user.tasks)

// }

// main()
