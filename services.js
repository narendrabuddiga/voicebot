const dbConnection = require('./db');


async function updateEchoData(req, cb) {
    try {
        let model = {
            conversationId: req.body.conversation,
            botName: req.body.bot,
        };
        let result = await dbConnection.fetchEchoData(model);
        if (!result) {
            await dbConnection.insertData(model);
        }
        console.log("Result:", result);
        let response = {
            activitiesURL: `conversation/${req.body.conversation}/activities`,
            refreshURL: `conversation/${req.body.conversation}/keepalive`,
            disconnectURL: `conversation/${req.body.conversation}/disconnect`,
            expiresSeconds: "120"
        };
        return cb(null, response);
    } catch (e) {
        return cb(e.message, null);
    }
}

exports.updateEchoData = updateEchoData;