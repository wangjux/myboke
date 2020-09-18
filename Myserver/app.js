var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router')
var path = require('path')

app.use(express.static(path.join(__dirname,'/public/')))
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use(router)

app.listen(2020,()=>{  
    console.log('http://127.0.0.1:2020')
})