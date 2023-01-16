 

const { col, createResponseID } = require('../../../tools');

module.exports = async (req, res) => {
    let pollID = req.params.id;
    let responder = null;
    if (req.body[' name'] || req.body[' name'] == "on") {
        if (!req.session.loggedin) {
            res.redirect('/login?r=polls/' + pollID);
        }
        responder = {
            id: req.session.data.id,
            un: req.session.data.un,
            nn: req.session.data.nn 
        };
    } else {
        responder = {
            id: "Anonymous",
            un: "Anonymous",
            nn: "Anonymous"
        };
    }
    let time = Date.now();
    let optKeys = Object.keys(req.body);
    if (req.body[' name']) {
        optKeys.splice(optKeys.indexOf(' name'), 1);
    }
    if (optKeys.length < 1) {
        req.flash('alert', 'You must choose at least 1 option!');
        res.redirect('/polls/' + pollID);
        return;
    }
    let pollData = await col.poll.findOne({ id: pollID });
    if (pollData.set.chooseOne === true) {
        if (optKeys.length > 1) {
            req.flash('alert', 'You can only choose one option');
            res.redirect('/polls/' + pollID);
            return;
        }
    }
    let responseData = {
        id: createResponseID().realPass,
        r: optKeys,
        u: responder,
        t: time,
        b: []
    }
    optKeys.forEach(async e => {
        pollData.respCh[e].push(responder.un);
    })

    await col.poll.updateOne({ id: pollID }, {$set: {respCh: pollData.respCh}});
    await col.poll.updateOne({ id: pollID }, {$push: {resp: responseData}});
    req.flash('alert', 'Your response has been recorded.');
    res.redirect('/');
}