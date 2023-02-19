module.exports = (req, res, next) => {
    if (!req.session.user) {
        res.send("You are not allowed to visit this page! Please, logged in!");
        return;
    }
    next();
};
