 

const { col, reportID } = require('../../../tools');

module.exports = async (req, res) => {
    req.body.userID = req.query.accID;
    let questionResult = await col.question.findOne({ id: req.body.questionID });
    let responseResult = questionResult.resp.find((i) => i.id === req.body.responseID);
    if (!questionResult || !responseResult) {
        req.flash('alert', "Question or Response Not Found.");
        res.redirect('/report');
        return;
    }
    if (responseResult.u.id === req.body.userID) {
        req.flash('alert', "You cannot report yourself.");
        res.redirect('/report');
        return;
    }
    if (responseResult.u.id === 'Anonymous') {
        req.flash('alert', "You cannot report an anonymous.");
        res.redirect('/report');
        return;
    }
    let suspended = responseResult.b.find(x => x.sus);
    if (suspended === undefined) {
        suspended = {sus: false};
    }
    if (suspended.sus === true) {
        req.flash('alert', "This question response is already suspended. Waiting for admin action.");
        res.redirect('/report');
        return;
    }
    let reporterData = await col.user.findOne({ id: req.body.userID });
    let rid = reportID();
    await col.data.updateOne({ id: 'ignotum' }, {$push: {reportIDs: rid}});
    let data = {
        type: "questionResponse",
        id: rid,
        question: {
            id: questionResult.id,
            creator: questionResult.u
        },
        response: {
            id: responseResult.id,
            response: responseResult.r,
            user: responseResult.u
        },
        reason: req.body.reasons,
        longReason: req.body.longReason,
        reporter: {
            id: reporterData.id,
            username: reporterData.un,
            nickname: reporterData.nn
        }
    }
    let questionResp = questionResult.resp;
    let responseData = questionResp.find(o => o.id === responseResult.id);
    let responseIndex = questionResp.indexOf(responseData);
    responseData.b.push({sus: true});
    questionResp.splice(responseIndex, 1, responseData);
    await col.question.updateOne({ id: questionResult.id }, {$set: {resp: questionResp}});
    await col.report.insertOne(data);
    res.redirect('/reportdone');
}