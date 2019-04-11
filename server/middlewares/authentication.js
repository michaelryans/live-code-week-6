const jwt = require('jsonwebtoken')
const User = require('../models/user')
module.exports = {
    isLogin(req,res,next) {
        try {
            const decoded = jwt.verify(req.headers.token, process.env.JWT_TOKEN)
            User.findOne({
                _id:decoded._id
            })
            .then(found => {
                if(found) {
                    req.decoded = decoded
                    next()
                }
            })
        }
        catch {
            res.status(401).json('gagal autentikasi')
        }   
    }
}