import User from '../models/user.js'
import passport from 'passport'
import asyncHandler from 'express-async-handler'

function getUserParams(body) {
    return {
        userName:  body.userName,
        email: body.email,
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
                req.flash("error", `Failed to create user account because: ${error.message}.`);
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
                req.session.user = {
                    id: user._id,
                    userName: user.userName,
                    email: user.email
                };

                return res.status(200).json({
                    message: 'Logged in successfully',
                    user: { id: user._id, userName: user.userName, email: user.email }
                });
            });
            
        })(req, res, next);
    },
    auth: asyncHandler(async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (user) {
                req.login(user, (err) => {
                    if (err) return next(err);
                    req.session.user = {
                        id: user._id,
                        userName: user.userName,
                        email: user.email
                    };
                    return res.status(200).json({
                        message: 'Logged in successfully',
                        user: { id: user._id, userName: user.userName, email: user.email }
                    });
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
                        req.flash("error", `Failed to create user account because: ${error.message}.`);
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
    })
}
