const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017/voicebot";
const dbName = "voicebot";


const dbConnection = (cb) => {
    MongoClient.connect(url, function(err, db) {
        if (err) return cb(err, null);
        console.log(".....................changesn")
        return cb(null, db);
    });
};

const createCollection = () => {
    return new Promise((resolve, reject) => {
        dbConnection((err, db) => {
            var dbo = db.db(dbName);
            dbo.createCollection("echoCollection", function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};

const insertData = (myobj) => {
    return new Promise((resolve, reject) => {
        dbConnection((err, db) => {
            var dbo = db.db(dbName);
            dbo.collection("echoCollection").insertOne(myobj, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};

const fetchEchoData = (query) => {
    return new Promise((resolve, reject) => {
        dbConnection((err, db) => {
            var dbo = db.db(dbName);
            dbo.collection("echoCollection").findOne(query, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};


exports.fetchEchoData = fetchEchoData;
exports.insertData = insertData;
exports.createCollection = createCollection;
exports.dbConnection = dbConnection;