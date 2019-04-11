const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        validate: [
            {
                validator: function (email) {
                    return User.find({
                        email: email
                    })
                        .then(found => {
                            if (found.length === 1) return false;
                        })
                },
                message: "email is registered, please use another email"
            },
            // {
            //     validator: function(email) {
            //         const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
            //         return regex.test(email)
            //     },
            //     message:"please input email"
            // }
        ]
    },
    password: {
        type: String,
    }
});

const User = mongoose.model('User', userSchema)

module.exports = User