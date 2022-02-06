const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://GabrielTSR:123654@cluster0.hb38b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
);
mongoose.Promise = global.Promise;

module.exports = mongoose;
