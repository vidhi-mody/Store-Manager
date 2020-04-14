
const User = require('../models/user')
const auth = require('../middleware/auth')
const express = require('express')

const router = express.Router()

router.post('/register/admin', async (req, res) => {
    const user = new User({
        username:req.body.username,
        password: req.body.password,
        userType:'admin'
    })
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.render("login")
    } catch (e) {
        res.render("error")
    }
})

router.post('/register/manager', async (req, res) => {
    const manager = new User({
        username:req.body.username,
        password: req.body.password,
        userType:'manager'
    })
    try {
        await manager.save()
        console.log(req.user)
        res.redirect("/secret")
        // res.render("secret",{
        //     user: req.user
            
        // });
    } catch (e) {
        console.log(e)
        res.render("error")
    }
})

router.post('/register/receptionist', async (req, res) => {
    console.log(req.user)
    const receptionist = new User({
        username:req.body.username,
        password: req.body.password,
        userType:'receptionist'
    })
    try {
        await receptionist.save()
        res.redirect("/secret")
    } catch (e) {
        console.log(e)
        res.render("error")
    }
})



router.get("/register", function(req, res){
    res.render("register");
})

router.get("/login", function(req, res){
    res.render("login");
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        return res.render("secret",{
            user: user
        });
    } catch (e) {
        res.render("login");
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.render("home")
    } catch (e) {
        console.log(e)
        res.render("error")
    }
})







router.get('/secret', async (req, res) => {
    res.render("secret")
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router