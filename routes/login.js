const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
module.exports = () => {
    router
        .get("/", (req, res) => {
            res.render("login", {pageMessage: ''});
        })
        .get("/login", (req, res) => {
            res.render("login", {pageMessage: ''});
        })

    router
        .post("/", async (req, res) => {
            const {email, password} = req.body;
            if (!email || !password) return res.send("Please enter all the fields");

            const doesUserExits = await User.findOne({email});

            if (!doesUserExits) {
                return res.render("login", {pageMessage: "user with such login doesnt exist"});
            }

            const doesPasswordMatch = await bcrypt.compare(
                password,
                doesUserExits.password
            );

            if (!doesPasswordMatch) {
                return res.render("login", {pageMessage: "invalid username or password"});
            }

            req.session.user = {
                email,
            };
            res.redirect("/home");
        })
    return router;
};
