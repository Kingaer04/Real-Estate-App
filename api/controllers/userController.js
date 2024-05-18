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
                req.flash("success", `${user.userName}'s account created successfully!`);
                res.status(201).json({
                    message: 'User created successfully',
                    // user: {
                    //     id: user._id,
                    //     userName: user.userName,
                    //     email: user.email,
                    //     // Add other user fields as necessary
                    // }
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
    authenticate: passport.authenticate("local", {
        failureRedirect: "user/signUp",
        failureFlash:"Failed to login",
        successRedirect: "/",
        successFlash: "Logged in!"
    })
}