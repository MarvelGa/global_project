const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = () => {
    router
        .get("/", (req, res) => {
            res.render("register", {pageMessage: ''});
        })
        .post("/", async (req, res) => {
            const {email, password} = req.body;
            if (!email || !password) {
                return res.render("register", {pageMessage: "Please fill in the fields"});
            }

            const userInDB = await User.findOne({email});

            if (userInDB) {
                return res.render("register", {pageMessage: "A user with that email already exits!"});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({email, password: hashedPassword});

            newUser
                .save()
                .then(() => {
                    req.session.congratmessage = {
                        message: 'Your registration was successful! Now Log In!',
                    };
                   return res.redirect("/login");
                })
                .catch((err) => console.log(err));
        });
    return router;
};
