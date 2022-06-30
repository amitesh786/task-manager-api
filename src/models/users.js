const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./tasks')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email : {
		type: String,
		unique: true,
		required : true,
		trim: true,
		lowercase: true,
		validate(val) {
			if (!validator.isEmail(val)) {
				throw new Error('Email is invalid')
			}
		}
	},
	age: {
		type: Number,
		default: 18,
		validate(value) {
			if(value < 18) {
				throw new Error('Age more than 18')
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
		validate(val) {
			if (val.toLowerCase().includes('password')) {
				throw new Error('Password cannot contain password')
			}
		}
	},
	tokens: [{
		token: {
			type : String,
			required : true
		}
	}],
	avatar: {
		type: Buffer
	}
}, {
	timestamps: true
})

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '',
	foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
	const user = this

	const token = jwt.sign( { _id: user._id.toString() }, process.env.JWT_SECRET)
	user.tokens = user.tokens.concat( {token})

	await user.save()
	return token
}

userSchema.methods.toJSON = async function() {
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens
	delete userObject.avatar
	// console.log(userObject)

	return userObject
}

userSchema.statics.findByCredentials = async function (email, password) {
	console.log(email, password)

	const user = await User.findOne({email})

	if (!user) {
		throw new Error('Unable to login user !!!')
	}

	// if(password !== user.password) {
	// 	console.log('check password ---------', password, user.password)
    //     throw new Error ('Incorrect Password !')
    // }

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		throw new Error('Unable to login in...!!!!')
	}

	return user
}

//  Hash the plan text password before saving
userSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

// Delete user tasks when user is required
userSchema.pre('remove', async function (next) {
	const user = this
	await Tasks.deleteMany( { owner: user._id })
	next()
})
const User = mongoose.model('User', userSchema)

module.exports = { User }
