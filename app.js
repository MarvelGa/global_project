const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const app = express();
const routes =require('./routes');
require('./startup/db')();
require('./startup/setting')(app);
mongoose.set("strictQuery", false);
app.set('trust proxy',1);
app.use(cookieSession({
        name:'session',
        keys: ["randomCookies"],
    })
);

app.set("view engine", "ejs");
app.use('/', routes({
})
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started listening on port: ${PORT}`);
});
