const express = require("express");
const authentication = require("../security/userAuthenticate");
const router = express.Router();
module.exports = () => {
    router.get("/", authentication, (req, res) => {
        req.session.user = null;
        res.redirect("/login");
    });
    return router;
};

