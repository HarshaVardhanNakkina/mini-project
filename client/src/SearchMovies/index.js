import React, { useState } from 'react'
import MovieCard from '../MovieCard'
import { useRecoilValue } from 'recoil'
import axios from 'axios'
import forge from 'node-forge'

import { userKeys, userDetails, serverPublicKey } from '../../store'

export default function SearchMovies() {
	const [query, setQuery] = useState('')
	const [movies, setMovies] = useState([])
	const server = useRecoilValue(serverPublicKey)
	const user = useRecoilValue(userDetails)
	const clientKeys = useRecoilValue(userKeys)

	const searchMovies = async (e) => {
		e.preventDefault()
		// states - input query, movies list
		const url = `${process.env.SEARCH_MOVIE_URL}?api_key=${process.env.MV_DB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
		const url_local = process.env.URL
		const { loggedin, email } = user
		const { server_pub } = server
		// encrypt client random with server's pub key
    const server_pub_key = forge.pki.publicKeyFromPem(server_pub)
    const queryBytes = forge.util.encodeUtf8(query)
    const enc_query = forge.util.encode64(server_pub_key.encrypt(queryBytes))
    axios.post(`${url_local}/movies`, { query: enc_query, loggedin, email }).then((result) => {
      const { data } = result
      if(loggedin) {
        const {privatekey} = clientKeys
        const dataBytes = privatekey.decrypt(forge.util.decode64(data))
        const movies = JSON.parse(forge.util.decodeUtf8(dataBytes))
        console.log("decrypted")
        console.log(movies)
      }
      console.log("plain")
      console.log(data)
    })

		try {
			const res = await fetch(url)
			const data = await res.json()
			setMovies(data.results)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<form className="form header" onSubmit={searchMovies}>
				<label className="label" htmlFor="query">
					Movie Name
				</label>
				<input
					className="input"
					type="text"
					name="query"
					placeholder="i.e. Jurassic Park"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value)
					}}
				/>
				<button className="button" type="submit">
					Search
				</button>
			</form>
			<div className="card--list">
				{movies
					.filter((movie) => movie.poster_path)
					.map((movie) => (
						<MovieCard movie={movie} key={movie.id} />
					))}
			</div>
		</>
	)
}
