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
                    if (err) {
                        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
                    }
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
                    const { hash, salt, ...rest } = user._doc;
                    res.cookie('token', token, {httpOnly: true }).status(200).json(rest);
                });
            } else {
                if (req.skip) return next();
                const randomPassword = Math.random().toString(36).slice(-8);
                const randomUserName = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
                const newUser = new User({ userName: randomUserName, email: email, avatar: req.body.photo });
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
    try {
        if (req.user.id !== req.params.id) return res.status(401).json({ error: 'Unauthorized! you can only update your account' });

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $set: getUserParams(req.body)
        }, { new: true })

        // Check if both old and new passwords are provided
        if (req.body.oldPassword && req.body.newPassword) {
            try {
                await updatedUser.changePassword(req.body.oldPassword, req.body.newPassword);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        } else if (req.body.oldPassword || req.body.newPassword) {
            return res.status(400).json({ error: 'Both old and new passwords must be provided.' });
        }
        updatedUser.changePassword = async function(oldPassword, newPassword) {
            // Check if the old password matches the one in the database
            const isMatch = await this.comparePassword(oldPassword);
            if (!isMatch) {
                throw new Error('Old password is incorrect');
            }
        
            // Update the password
            this.password = newPassword;
            await this.save();
        }

        res.status(200).json(updatedUser);
        } catch (error) {
        next(error);
        }
    },
    delete: async (req, res, next) => {
        if(req.user.id !== req.params.id) return (res.status(401).json({message: 'Unauthorized! You can only delete your account'}))
        try{
            await User.findByIdAndDelete(req.params.id)
            res.clearCookie('token')
            res.status(200).json("User Account deleted successfully!")
        }catch(error){
            next(error)
        }
    },
    signOut: async (req, res, next) => {
        try {
            res.clearCookie('token')
            res.status(200).json("User has logged out!")
        } catch (error) {
            next(error)
        }
    }
}
