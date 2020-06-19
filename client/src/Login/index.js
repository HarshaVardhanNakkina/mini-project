import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import forge from 'node-forge'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { userKeys, userDetails, serverPublicKey } from '../../store'

export default function Login(props) {
	const [email, setemail] = useState('')
	const [password, setpassword] = useState('')
	const [loginstatus, setloginstatus] = useState('')
	const [showloginstatus, setshowloginstatus] = useState(false)
	const setUserKeys = useSetRecoilState(userKeys)
  const setUserDetails = useSetRecoilState(userDetails)
  const server = useRecoilValue(serverPublicKey)
	const url = process.env.URL

	// console.log(props)
	function handleLogin(event) {
		event.preventDefault()
		const rsa = forge.pki.rsa
		rsa.generateKeyPair({ bits: 2048, workers: -1 }, function (err, keypair) {
			// keypair.privateKey, keypair.publicKey
			if (err) {
				console.log(err)
				return
			}
			const { privateKey, publicKey } = keypair
			const pubkey_pem = forge.pki.publicKeyToPem(publicKey)
      console.log("client: send auth request")
			axios
				.post(`${url}/users/login`, { email, password, pubkey_pem })
				.then((result) => {
					const { data } = result
          const { status, msg, body } = data
          console.log(msg);
          console.log("client: received challenge", result);
					// DECRYPT THE CHALLENGE
					const bodyBytes = privateKey.decrypt(forge.util.decode64(body))
          const decData = forge.util.decodeUtf8(bodyBytes)
          console.log("client: challenge decrypted successfully");
          console.log(JSON.parse(decData))

					if (status === 200) {
						setUserKeys((keys) => {
							return {
								...keys,
								privatekey: forge.pki.privateKeyToPem(privateKey),
								publickey: pubkey_pem,
							}
						})
						const { username, email, challenge } = JSON.parse(decData)
						setUserDetails((details) => {
							return { ...details, username, email, loggedin: true }
						})
						// SEND DECRYPTED CHALLENGE
						forge.random.getBytes(32, function (err, bytes) {
							if (err) next(err)
              const client_random = forge.util.bytesToHex(bytes)
							// HASH THE CHALLENGE + client_random
							const md = forge.md.sha256.create()
							md.update(JSON.stringify({challenge, client_random}))
              const hash_challenge = md.digest().toHex()
              const { server_pub } = server
              // encrypt client random with server's pub key
              const server_pub_key = forge.pki.publicKeyFromPem(server_pub)
              const enc_random = forge.util.encode64(server_pub_key.encrypt(bytes))

              console.log("client: requesting for verification")
              axios.post(`${url}/users/challengeresponse`, {
                hash_challenge,
                enc_random
              }).then((result) => {
                console.log(result.data.msg);
              }).catch((err) => {
                console.log(err)
              })

						})
					}
				})
				.catch((err) => {
					console.log(err)
				})
		})
	}
	return (
		<div className="form-container">
			<h2 className="form-heading">Login</h2>
			<form className="login-form" onSubmit={handleLogin}>
				<label htmlFor="email">Email: </label>
				<input
					className="input-field"
					type="email"
					name="email"
					id="email"
					placeholder="e.g. john@doe.com"
					onChange={(e) => {
						setemail(e.target.value)
					}}
				/>

				<label htmlFor="password">Password: </label>
				<input
					className="input-field"
					type="password"
					name="password"
					id="password"
					placeholder="#[a-b][A-B][0-9]"
					onChange={(e) => {
						setpassword(e.target.value)
					}}
				/>
				<button className="input-field btn-primary" type="submit">
					Login
				</button>
			</form>
			{loginstatus.length > 0 && <p className="request-status"> loginstatus</p>}
		</div>
	)
}
