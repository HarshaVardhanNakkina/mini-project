const express = require('express')
const router = express.Router()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const forge = require('node-forge')

router.get('/register', function (req, res, next) {
	res.send('respond with a resource')
})

router.post('/register', function (req, res, next) {
	const { username, password, email } = req.body
	const user = db.get('users').find({ email: email }).value()
	if (user && typeof user !== 'undefined') {
		res.status(400).send('email already exists')
	} else {
		db.get('users').push(req.body).last().write()
		res.status(200).send('registration successful')
	}
})

router.post('/login', function (req, res, next) {
  const { email, password, pubkey_pem } = req.body;
  const user = db.get('users').find({ "email": email }).value() 
  if(user) {  
    if(user.password === password) {
      const { username, email } = user
      db.get('users').find({ "email": email }).assign({ "publickey": pubkey_pem }).write()
      forge.random.getBytes(32, function(err, bytes) {
        if(err) next(err)
        client_pubkey = forge.pki.publicKeyFromPem(pubkey_pem)
        const challenge = forge.util.bytesToHex(bytes);
        db.set('server.challenge', challenge).write()
        const bodyBytes = forge.util.encodeUtf8(JSON.stringify({ username, email, challenge }))
        const body = forge.util.encode64(client_pubkey.encrypt(bodyBytes))
        res.send({ status: 200, msg:'server: logged in successfully', body })
      });

    }
    else
      res.send({ status: 404, msg: 'server: incorrect password'})
  }
  else
    res.send({ status: 404, msg: 'server: incorrect password'})
})

router.post('/challengeresponse', function(req, res, next) {
  const private_key = forge.pki.privateKeyFromPem(db.get('server.privatekey').value())
  const challenge = db.get('server.challenge').value()
  
  const { hash_challenge, enc_random } = req.body
  const client_random = forge.util.bytesToHex(private_key.decrypt(forge.util.decode64(enc_random)))
  
  const md = forge.md.sha256.create()
  md.update(JSON.stringify({challenge, client_random}))
  const calc_hash = md.digest().toHex()

  if(calc_hash === hash_challenge) {
    res.send({ status: 200, msg:'server: client verified', body:{} })
  }else {
    res.send({ status: 404, msg:'server: unknown client/error verifying', body:{} })
  }

})


module.exports = router
