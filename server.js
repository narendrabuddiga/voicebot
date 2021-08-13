const express = require('express');
const bodyParser = require('body-parser');
const services = require('./services');
const Joi = require('joi');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
require('./db');

app.post('/echo/', (req, res) => {
    const schema = Joi.object({
        conversation: Joi.string().min(3).required(),
        bot: Joi.string()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }
    services.updateEchoData(req, (err, response) => {
        console.log(response);
        res.send(response);
    });
});

const portNo = process.env.PORT || 3000;
app.listen(portNo, () => {
    // console.log(process.env);
    console.log(`listening at port Number:${portNo} ....`);
});