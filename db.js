import { MongoClient } from 'mongodb';
const url = "mongodb://localhost:27017/voicebot";
const dbName = "voicebot";


const dbConnection = (cb) => {
    MongoClient.connect(url, (err, db)=> {
        if (err) return cb(err, null);
        console.log(".....................changes");
        return cb(null, db);
    });
};

const createCollection = () => {
    return new Promise((resolve, reject) => {
        dbConnection((err, db) => {
            let dbo = db.db(dbName);
            dbo.createCollection("echoCollection", (err, res)=> {
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};

const insertData = (myobj) => {
    return new Promise((resolve, reject) => {
        dbConnection((err, db) => {
            let dbo = db.db(dbName);
            dbo.collection("echoCollection").insertOne(myobj, (err, res) =>{
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};

const fetchEchoData = (query) => {
    return new Promise((resolve, reject) => {
        dbConnection((err, db) => {
            let dbo = db.db(dbName);
            dbo.collection("echoCollection").findOne(query, (err, res)=> {
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};


const _fetchEchoData = fetchEchoData;
export { _fetchEchoData as fetchEchoData };
const _insertData = insertData;
export { _insertData as insertData };
const _createCollection = createCollection;
export { _createCollection as createCollection };
const _dbConnection = dbConnection;
export { _dbConnection as dbConnection };