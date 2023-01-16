 

const { MongoClient, ServerApiVersion } = require('mongodb');
const pwgenerator = require('generate-password');
const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


let col = {
    user: null,
    question: null,
    report: null,
    data: null,
    poll: null,
    badge: null
};

function connect() {
    client.connect(err => {
        if (err) console.log(err);
        col.user = client.db("main").collection("user");
        col.question = client.db("main").collection("question");
        col.report = client.db("main").collection("report");
        col.data = client.db("main").collection("data");
        col.poll = client.db("main").collection("poll");
        col.badge = client.db("main").collection("badge");

        console.log('Successfully Connect to the Database!');

        col.data.findOne({ id: 'ignotum' }, (err, res) => {
            if (err) console.log(err);
            if (!res) {
                console.log('Data in the collection "data" is missing. Is the database being reset? Adding a new one now.');
                col.data.insertOne({
                    id: 'ignotum',
                    reportIDs: [],
                    questionIDs: [],
                    userIDs: [],
                    pollIDs: []
                });
                console.log('Success!')
            }
        });
    });
}


function createUserID() {
    let password = pwgenerator.generate({
        length: 15,
        numbers: true,
        uppercase: true,
        strict: true,
        lowercase: true,
        symbols: false
    });
    return password;
};

function questionID() {
    let password = pwgenerator.generate({
        length: 8,
        numbers: true,
        uppercase: true,
        strict: true,
        lowercase: true,
        symbols: false
    });
    return password;
}

function reportID() {
    let password = pwgenerator.generate({
        length: 8,
        numbers: true,
        uppercase: true,
        strict: true,
        lowercase: true,
        symbols: false
    });
    return password;
}

function createResponseID(QID) {
    let password = pwgenerator.generate({
        length: 5,
        numbers: true,
        uppercase: true,
        strict: true,
        lowercase: true,
        symbols: false
    });
    return {
        realPass: password,
        dbPass: `${QID}/${password}`
    };
}

let template = {
    user: (username, password, nickname) => {
        return {
            "id": createUserID(),
            "un": username,
            "pw": password,
            "nn": nickname,
            "q": [],
            "b": [],
            "p": []
        };
    },
    question: (uploader, time, title, private) => {
        return {
            "id": questionID(),
            "u": uploader,
            "t": time,
            "tit": title,
            "resp": [],
            "b": [],
            "pr": private,
            "respCom": []
        };
    },
    report: (type, reporter, data, reason) => {
        return {
            "tp": type,
            "rep": reporter,
            "d": data,
            "r": reason
        }
    },
    poll: (uploader, time, title, private, choices, settings, respChoices) => {
        return {
            "id": questionID(),
            "u": uploader,
            "t": time,
            "tit": title,
            "pr": private,
            "ch": choices,
            "set": settings,
            "resp": [],
            "respCh": respChoices,
            "b": []
        }
    }
}

/* Todo:
    - create render() function
      - bikin variable di simpan di "v": {variable...}
    - benerin response id pas view response
    - rewrite id system
 */

module.exports = { col, template, questionID, createResponseID, reportID, connect }