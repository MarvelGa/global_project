const express =require('express');
const app = express();
const bodyParser = require('body-parser')
var path = require('path');
module.exports=app=>{
    app.use(express.urlencoded({extended: true}));
    app.use(express.json()) // To parse the incoming requests with JSON payloads
    app.use(express.static('public'))
    app.set("view engine", "ejs")
    app.use(bodyParser.urlencoded({extended:true}));
}
