import express from 'express'
import {userController} from "../controllers/userController.js"

const router = express.Router()

router.post('/signUp', userController.create)

export default router
