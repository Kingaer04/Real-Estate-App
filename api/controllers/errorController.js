const httpStatusCode = require("http-status-codes")

module.exports = {
    pageNotFound: (req, res) => {
        let errorCode = httpStatusCode.NOT_FOUND
        res.status(errorCode)
        res.send(`${errorCode} || NOT FOUND`)
    },
    internalServerError: (error, req, res, next) =>  {
        let errorCode = httpStatusCode.INTERNAL_SERVER_ERROR
        res.status(errorCode)
        console.log(error.message)
        res.send(`${errorCode} || Page sleeping`)
    }
}
