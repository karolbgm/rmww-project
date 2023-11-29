const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users')

sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs', { 
        currentUser: req.session.currentUser
    })
})

sessions.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if(err) {
            console.log(err)
            res.send('oops, you hit an error')
        } else if (!foundUser) {
            res.send('<a href="/">Sorry, no user found</a>')
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
               req.session.currentUser = foundUser
               res.redirect('/spots')
            } else {
                res.send('<a href="/">Password does not match </a>')
            }
        }
    })
})

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/spots')
    })
})

module.exports = sessions