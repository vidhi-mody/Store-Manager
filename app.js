const express = require('express')
const path = require('path')
require('./db/mongoose')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8080

const publicDirPath = path.join(__dirname, './public')

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(userRouter)

app.use(express.static(publicDirPath))


app.get("/",function(req,res){
    res.render("home");
});

app.get("*",function(req,res){
    res.render("404");
});

app.listen(port, () => {
    console.log('Server is up and running')
})