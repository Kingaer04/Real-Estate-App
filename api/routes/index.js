import express from "express"
import userRouter from "./userRoute.js"
import authRouter from "./authRoute.js"


const router = express.Router()

router.use("/user", authRouter)
router.use('/sub', userRouter)

export default router
