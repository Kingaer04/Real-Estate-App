import User from '../models/user.js'
import passport from 'passport'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

function getUserParams(body) {
    return {
        userName:  body.userName,
        email: body.email,
        avatar: body.avatar
    }
}

export const userController = {
    index: (req, res) => {
        res.json({'message': 'Hello world'});
    },
    create: (req, res, next) => {
        if (req.skip) return next();

        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                res.status(201).json({
                    message: 'User created successfully',
                });
            } else {
                res.status(400).json({
                    error: `Failed to create user account`,
                    message: error.message
                });
                next(error);  // Pass the error to the next middleware
            }
        });
    },
    authenticate: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error', error: err.message });
            }
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed', error: info.message });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
                }
                const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
                const {hash: has, salt:sal, ...rest} = user._doc
                res.cookie('token', token, {httpOnly: true}).status(200).json(rest)      
            });
            
        })(req, res, next);
    },
    auth: asyncHandler(async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (user) {
                req.login(user, (err) => {
                    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {httpOnly: true})
                    const{hash: has, salt: sal, ...rest} = user._doc
                    res.cookie('token', token, {httpOnly: true}).status(200).json(rest)
                });
            } else {
                if (req.skip) return next();
                const randomPassword = Math.random().toString(36).slice(-8);
                const randomUserName = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)
                const newUser = new User({userName: randomUserName, email: email, avatar: req.body.photo});
                User.register(newUser, randomPassword, (error, user) => {
                    if (user) {
                        res.status(201).json({
                            message: 'User created successfully'
                        });
                    } else {
                        res.status(400).json({
                            error: `Failed to create user account`,
                            message: error.message
                        });
                        next(error);
                    }
                });
            }
        } catch (error) {
            console.error('Error in auth middleware:', error);
            next(error);
        }
    }),
    verifyToken: (req, res, next) => {
        const token = req.cookies.token

        if(!token) return next(res.status(401).json({message: 'Unauthorized'}))

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next(res.status(403).json({message:'forbidden'}))
            
            req.user = user
            next()
        })
    },
    update: async (req, res, next) => {
        if(req.user.id !== req.params.id) return (res.status(401).json({message: `Unauthorized! you can only update your account${req.user.id}`}))
        try {
            const updatedUser = await User.findByIdAndUpdate(req.user.id, 
                {$set: getUserParams(req.body)}, { new: true });
            await updatedUser.changePassword(req.body.oldPassword, req.body.newPassword)
            res.status(200).json(updatedUser);
        } catch(error) {
            next(error)
        }
    }
}
