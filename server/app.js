//express dotenv 
const express = require('express')
const app = express();
require('dotenv').config()

//mongoose
const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/classic_fox_live_code_1', {useNewUrlParser:true})

//cors
const cors = require('cors')
app.use(cors())

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//models
const User = require('./models/user')
const Joke = require('./models/joke')

//jwt, bcrypt
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//middlewares
const {isLogin} = require('./middlewares/authentication')
const {isAuthorized} = require('./middlewares/authorization')


app.delete('/favorites/:id', isLogin, isAuthorized, (req,res) => {
    Joke.findOneAndDelete({
        _id:req.params.id   
    })
    .then(deleted => {
        res.status(204).json({
            message:"successfully deleted id " + req.params.id,
            deleted:deleted
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err,
            message:"error deleting task"
        })
    })
})

app.post('/favorites', isLogin, (req,res) => {
    Joke.create({
        joke: req.body.joke,
        user: req.decoded._id
    })
    .then(created => {
        res.status(201).json(created)
    })
    .catch(err => {
        res.status(500).json({
            message:"gagal create favorite user",
            error:err
        })
    })
})

app.get('/favorites', isLogin, (req,res) => {
    Joke.find({
        user:req.decoded._id
    })
    .then(found => {
        res.status(200).json(found)
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            message: "error fetching favorites -server"
        })
    })
})

app.post('/login', (req,res) => {
    console.log('server- masuk login')
    User.findOne({email:req.body.email})
    .then(found => {
        if(bcrypt.compareSync(req.body.password, found.password)) {
            const server_token = jwt.sign({
                _id:found._id,
                email: found.email,
            }, process.env.JWT_TOKEN)
            res.status(201).json({
                message:"successfully logged in",
                token: server_token
            })
        } else {
            throw new Error("error login, wrong credentials",)
        }
    })
    .catch(err => {
        res.status(500).json({
            message:"error login, wrong credentials",
            error:err
        })
    })
})

app.post('/register', (req,res) => {
    User.create({
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password, 10)
    })
    .then(created => {
        res.status(201).json(created)
    })
    .catch(err => {
        res.status(500).json({
            error:err,
            message: "error register on server"
        })
    })
})


app.get('/*', (req,res) => {
    res.status(404).json("not found 404")
})



const PORT = 3000;
app.listen(PORT, ()=> {
    console.log(`app is listening on port ${PORT}`)
})