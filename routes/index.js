const express = require("express");
const router = express.Router();
const authentication = require("../security/userAuthenticate");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const bcrypt = require("bcrypt");
const feedbackRoute = require('./feedback');
module.exports=params=>{
router
    .get("/", (req, res) => {
        res.render("login", {pageMessage:'' });
    })
    .get("/login", (req, res) => {
        res.render("login", {pageMessage:'' });
    })
    .get("/register", (req, res) => {
        res.render("register", {pageMessage:''});
    })
    .get("/home", authentication, (req, res) => {
        res.render("home", { user: req.session.user });
    });
    // .get("/feedback", authentication, (req, res) => {
    //     res.render("feedback", { user: req.session.user });
    // });
    router
    .post("/login", async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.send("Please enter all the fields");

        const doesUserExits = await User.findOne({email});

        if (!doesUserExits){
            return res.render("login", {pageMessage:"user with such login doesnt exist" });
        }

        const doesPasswordMatch = await bcrypt.compare(
            password,
            doesUserExits.password
        );

        if (!doesPasswordMatch) {
            return res.render("login", {pageMessage:"invalid username or password"});
        }

        // else he\s logged in
        req.session.user = {
            email,
        };
        res.redirect("/home");
    })
    .post("/register", async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password){
            return res.render("register", {pageMessage:"Please fill in the fields"});
        }

        const userInDB = await User.findOne({ email });

        if (userInDB){
            return res.render("register", {pageMessage: "A user with that email already exits!"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ email, password: hashedPassword });

        newUser
            .save()
            .then(() => {
                res.redirect("/login");
            })
            .catch((err) => console.log(err));
    });


//logout
    router.get("/logout", authentication, (req, res) => {
    req.session.user = null;
    res.redirect("/login");
});
    router.use('/feedback', feedbackRoute(params));
return router
};
