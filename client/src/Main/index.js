import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { RecoilRoot } from 'recoil'


import Home from '../Home'
import Register from '../Register'
import Login from '../Login'

export default function Main() {
	return (
		<RecoilRoot>
			<nav className='navbar'>
				<ul className='nav-items'>
					<li className='nav-link'>
						<Link to="/home">Home</Link>
					</li>
					<li className='nav-link'>
						<Link to="/register">Register</Link>
					</li>
					<li className='nav-link'>
						<Link to="/login">Login</Link>
					</li>
				</ul>
			</nav>
			<main className='main-container'>
				<Switch>
					<Route path="/" exact>
						<Home />
					</Route>
					<Route path="/home">
						<Home />
					</Route>
					<Route path="/register">
						<Register />
					</Route>
					<Route path="/login">
            <Login />
          </Route>
				</Switch>
			</main>
		</RecoilRoot>
	)
}
