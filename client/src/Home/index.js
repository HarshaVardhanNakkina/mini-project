import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { serverPublicKey, userDetails } from '../../store'
import axios from 'axios'

import SearchMovies from '../SearchMovies'

export default function Home() {
	const user = useRecoilValue(userDetails)
	const { username, email } = user
	const [loggedin, setloggedin] = useState(
		username.length > 0 && email.length > 0 ? true : false
	)
	const setServerPublicKey = useSetRecoilState(serverPublicKey)
	const url = process.env.URL
	axios
		.get(`${url}/getpublickey`)
		.then((result) => {
			const {
				data: { msg, status, body },
			} = result
			setServerPublicKey((oldkey) => {
				return { ...oldkey, server_pub: body.key }
			})
		})
		.catch((err) => {
			console.log(err)
		})

	return (
		<div className="container">
			<h1 className="title header">React Movie Search</h1>
			<SearchMovies/>
		</div>
	)
}
