const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
module.exports = () => {
    router
        .get("/", (req, res) => {
            let congratsMessage = req.session.congratmessage ? req.session.congratmessage.message : '';
            req.session.congratmessage = {};
            res.render("login", {congratsMessage, pageMessage: ''});
        })
        .get("/login", (req, res) => {
            let congratsMessage = req.session.congratmessage ? req.session.congratmessage.message : '';
            req.session.congratmessage = {};
            res.render("login", {congratsMessage, pageMessage: ''});
        })

    router
        .post("/", async (req, res) => {
            const {email, password} = req.body;
            if (!email || !password) return res.send("Please enter all the fields");

            const doesUserExits = await User.findOne({email});

            if (!doesUserExits) {
                return res.render("login", {pageMessage: "user with such login doesnt exist", congratsMessage: ""});
            }

            const doesPasswordMatch = await bcrypt.compare(
                password,
                doesUserExits.password
            );

            if (!doesPasswordMatch) {
                return res.render("login", {pageMessage: "invalid username or password", congratsMessage: ""});
            }

            req.session.user = {
                email,
            };
            res.redirect("/home");
        })
    return router;
};
