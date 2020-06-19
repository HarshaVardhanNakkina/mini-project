const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

// const forge = require('node-forge')
// const rsa = forge.pki.rsa
// rsa.generateKeyPair({ bits: 2048, workers: -1 }, function (err, keypair) {
// 	// keypair.privateKey, keypair.publicKey
// 	if (err) console.log(err)
// 	else {
//     const { publicKey, privateKey } = keypair
// 		db.set('server.privatekey', forge.pki.privateKeyToPem(privateKey)).write()
// 		db.set('server.publickey', forge.pki.publicKeyToPem(publicKey)).write()
// 	}
// })

const indexRouter = require('./routes/index')
const usersRouter = require('./api/v1/users')
const moviesRouter = require('./api/v1/movies')
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/getpublickey', indexRouter)
app.use('/users', usersRouter)
app.use('/movies', moviesRouter)

module.exports = app
