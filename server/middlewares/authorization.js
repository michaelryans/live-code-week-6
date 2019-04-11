const jwt = require('jsonwebtoken');
const Joke = require('../models/joke')

module.exports = {
    isAuthorized(req,res,next) {
        Joke.findOne({
            _id:req.params.id
        })
        .then(found => {
            if(found.user == req.decoded._id) {
                next()
            } else {
                res.status(403).json({
                    message:"authorization in middleware failed",
                })
            }
        })
    }
}