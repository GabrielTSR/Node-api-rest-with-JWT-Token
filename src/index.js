const express = require('express');
const bodyParser = require('body-parser');

const controller = require('./app/controllers');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(controller);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server Running at Port: ${PORT}`);
});
