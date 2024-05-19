import user from '../models/user.js'
import passport from 'passport'

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

        let newUser = new user(getUserParams(req.body));
        user.register(newUser, req.body.password, (error, user) => {
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
    }
}
