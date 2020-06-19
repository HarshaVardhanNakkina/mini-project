import { atom , selector } from 'recoil'

export const serverPublicKey = atom({
  key: 'serverPublicKey',
  default: {
    server_pub: ''
  }
})

export const userKeys = atom({
	key: 'userKeys',
	default: {
    privatekey: '',
    publickey: ''
  }
})

export const userDetails = atom({
  key: 'userDetails',
  default: {
    username: '',
    email: '',
    loggedin: false
  }
})
