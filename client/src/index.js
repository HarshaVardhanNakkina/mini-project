import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import Main from './Main'

render(
	<Router>
		<RecoilRoot>
			<Main />
		</RecoilRoot>
	</Router>,
	document.getElementById('root')
)
