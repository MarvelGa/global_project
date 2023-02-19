const express = require("express");
const authentication = require("../security/userAuthenticate");
const router = express.Router();
module.exports=()=>{
router
    .get("/", authentication, (req, res) => {
        res.render("home", { user: req.session.user, congratsMessage: "" });
    });
    return router;
};
