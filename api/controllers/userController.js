import user from '../models/user.js'

export const userController = {
    index: (req, res) => {
        res.json({'message': 'Hello world'})
    }
}
