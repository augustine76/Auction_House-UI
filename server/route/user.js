import express from 'express'
import {
  createUser,
  fetchAllUsers,
  editUser,
  signIn,
  signOut,
} from '../controller/api.js'

const router = express.Router()

router.post('/createUser', createUser)
router.post('/editUser', editUser)
router.post('/signIn', signIn)
router.post('/signOut', signOut)
router.get('/fetchAllUsers', fetchAllUsers)

export default router
