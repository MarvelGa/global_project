const express = require("express");
const router = express.Router();
const feedbackRoute = require("./feedback");
const logoutRoute = require("./logout");
const homeRoute =require("./home")
const loginRoute =require("./login")
const registerRoute =require("./register")

module.exports=()=>{
    router.use('/register', registerRoute());
    router.use('/login', loginRoute());
    router.use('/', loginRoute());
    router.use('/home', homeRoute());
    router.use('/logout', logoutRoute());
    router.use('/feedback', feedbackRoute());

return router
};
