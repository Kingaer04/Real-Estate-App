// import httpStatusCode from "http-status-codes"

// export default  errorController = {
//     pageNotFound: (req, res) => {
//         let errorCode = httpStatusCode.NOT_FOUND
//         return res.status(errorCode).json({
//             success: false,
//             errorCode,
//             message,
//         })
//     },
//     internalServerError: (error, req, res, next) =>  {
//         const errorCode = httpStatusCode.INTERNAL_SERVER_ERROR
//         const message = error.message || 'Internal Server Error'
//         return res.status(errorCode).json({
//             success: false,
//             errorCode,
//             message,
//         })
//     }
// }
