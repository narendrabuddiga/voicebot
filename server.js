import express, { json } from 'express';
import { urlencoded } from 'body-parser';
import { updateEchoData } from './services';
import { object, string } from 'joi';
import './db';

const app = express();
app.use(urlencoded({ extended: true }));

app.use(json());

app.post('/echo/', (req, res) => {
    const schema = object({
        conversation: string().min(3).required(),
        bot: string()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }
    updateEchoData(req, (err, response) => {
        console.log(response);
        res.send(response);
    });
});

const portNo = process.env.PORT || 3000;
app.listen(portNo, () => {
     console.log(process.env);
    console.log(`listening at port Number:${portNo} ....`);
    console.log(".....................changes");
});