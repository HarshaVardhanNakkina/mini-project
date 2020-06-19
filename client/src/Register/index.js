import React from 'react'
import { useState } from 'react'
import axios from 'axios'

export default function Register(props) {
	const [username, setusername] = useState('')
	const [email, setemail] = useState('')
	const [password, setpassword] = useState('')
	const [reqSuccess, setreqSuccess] = useState(true)
	const [showreqStatus, setshowreqStatus] = useState(false)
	const url = process.env.URL
	// const [publicKey, setpublicKey] = useState('')
	const hideReqStatus = () => {
    setshowreqStatus(false)
	}
	const showReqStatus = () => {
		setshowreqStatus(true)
	}
	function register(e) {
		e.preventDefault()
		axios
			.post(`${url}/users/register`, {
				username,
				password,
				email,
			})
			.then((result) => {
        props.history.push('/login')
				// showReqStatus()
				// setreqSuccess(true)
				// setTimeout(() => {
				// 	hideReqStatus()
				// }, 5000)
			})
			.catch((err) => {
				showReqStatus()
				setreqSuccess(false)
				setTimeout(() => {
					hideReqStatus()
				}, 5000)
			})
	}
	const bgcolor = reqSuccess ? '#d4edda' : '#f8d7da'
	const color = reqSuccess ? '#155724' : '#721c24'
	const reqMsg = reqSuccess ? 'Registration successful' : 'Registration Failed'

	return (
		<div className="form-container">
			<h2 className="form-heading">Register</h2>
			<form className="registration-form" onSubmit={register}>
				<label htmlFor="username">Username: </label>
				<input
					className="input-field"
					type="text"
					name="username"
					id="username"
					placeholder="e.g. John Doe"
					onChange={(e) => {
						setusername(e.target.value)
					}}
				/>

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

				{/* <label htmlFor="publickey">Publick key:</label>
				<textarea
					className="input-field"
					name="public key"
					id="publickey"
					cols="30"
					rows="10"
					placeholder="paste your public key here"
					onChange={(e) => {
						setpublicKey(e.target.value)
					}}
				></textarea> */}
				<button className="input-field btn-primary" type="submit">
					Register
				</button>
			</form>
			{showreqStatus && (
				<div
					className="request-status"
					style={{ backgroundColor: bgcolor, color }}
				>
					{reqMsg}
				</div>
			)}
		</div>
	)
}
