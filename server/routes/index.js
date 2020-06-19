var express = require('express');
var router = express.Router();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({msg:'server public key', status: 200, body: { key: db.get('server.publickey').value() } } )
});

module.exports = router;
