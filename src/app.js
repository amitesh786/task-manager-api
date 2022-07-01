const express = require('express')
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs')

// load database
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter)
app.use(taskRouter)

module.exports = app
