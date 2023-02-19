const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/testDB';
module.exports = () => {
    mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('successfully connected to mongodb cloud!');
        })
        .catch((err) => {
            console.log(err);
        });
};
