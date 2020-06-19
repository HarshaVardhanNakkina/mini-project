const express = require('express')
const router = express.Router()
const axios = require('axios')
const low = require('lowdb')

const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const forge = require('node-forge')

router.post('/', function(req, res, next) {
  const { query, loggedin, email } = req.body

  const private_key = forge.pki.privateKeyFromPem(db.get('server.privatekey').value())
  const queryBytes = private_key.decrypt(forge.util.decode64(query))
  const dec_query = forge.util.decodeUtf8(queryBytes)
  const url = `${process.env.SEARCH_MOVIE_URL}?api_key=${process.env.MV_DB_API_KEY}&language=en-US&query=${dec_query}&page=1&include_adult=false`

  axios.get(url).then((result) => {
    const { data } = result
    if(loggedin){
      const user = db.get('users').find({"email": email}).value()
      const user_pub_key = forge.pki.publicKeyFromPem(user.publickey)
      const resString = JSON.stringify(data)
      const resBytes = forge.util.encodeUtf8(resString)
      const movies = forge.util.encode64(user_pub_key.encrypt(resBytes))
      res.send(movies)
    }else res.send(data)
  }).catch((err) => {
    console.log(err);
  });

})

module.exports = router