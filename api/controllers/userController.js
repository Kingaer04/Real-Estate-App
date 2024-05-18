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
        res.json({'message': 'Hello world'})
    },
    signUp: (req, res, next) => {
        if (req.skip) next()
        let newUser = new user(getUserParams(req.body))
        user.register(newUser, req.body.password, (error, user) => {
            if(user) {
                req.flash("success", `${user.userName}'s account created successfully!`)
                res.locals.redirect = '/user/test'
                next()
            }
            else {
                req.flash("error", `Failed to create user account because: ${error.message}.`)
                res.locals.redirect = "/signUp"
                next()
            }
        })
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/signUp",
        failureFlash:"Failed to login",
        successRedirect: "/",
        successFlash: "Logged in!"
    })
}
