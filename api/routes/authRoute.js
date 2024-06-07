import express from 'express'
import {userController} from "../controllers/userController.js"

const router = express.Router()

router.post('/signUp', userController.create)
router.post('/signIn', userController.authenticate)
router.post('/google', userController.auth)
router.post('/update/:id', userController.verifyToken, userController.update)
router.delete('/delete/:id', userController.verifyToken, userController.delete)
router.get('/signOut', userController.signOut)

export default router
