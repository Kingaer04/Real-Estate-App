import express from 'express'
import {userController} from "../controllers/userController.js"

const router = express.Router()

router.post('/signUp', userController.create)
router.post('/signIn', userController.authenticate)

export default router
