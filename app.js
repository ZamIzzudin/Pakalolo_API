const express = require('express');
const bodyParser = require('express');
const cors = require('cors');
const helmet = require('helmet');

const port = process.env.PORT || 8080;
const app = express();

const router = require('./src/routes');

app.use(cors());

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('', (req, res) => {
    res.send({
        status: 'success',
        message: 'API run properly'
    })
})

app.use('/', router)

app.get('*', (req, res) => {
    res.send({
        status: 404,
        message: 'inappropriate command, please read the documentation at {LINK}'
    })
})

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
