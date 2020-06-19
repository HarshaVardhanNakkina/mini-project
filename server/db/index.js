const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
// const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ users: [], server: {} }).write()
