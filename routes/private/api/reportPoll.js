 

const { col, reportID } = require('../../../tools');

module.exports = async (req, res) => {
    req.body.userID = req.query.accID;
    let questionResult = await col.poll.findOne({ id: req.body.poll });
    if (!questionResult) {
        req.flash('alert', "Poll Not Found.");
        res.redirect('/report');
        return;
    }
    if (questionResult.u.id === req.body.userID) {
        req.flash('alert', "You cannot report your own poll.");
        res.redirect('/report');
        return;
    }
    let suspended = questionResult.b.find(x => x.sus);
    if (suspended === undefined) {
        suspended = {sus: false};
    }
    if (suspended.sus === true) {
        req.flash('alert', "This poll is already suspended. Waiting for admin action.");
        res.redirect('/report');
        return;
    }
    let reporterData = await col.user.findOne({ id: req.body.userID });
    let rid = reportID();
    await col.data.updateOne({ id: 'ignotum' }, {$push: {reportIDs: rid}});
    let data = {
        type: "poll",
        id: rid,
        poll: {
            id: questionResult.id,
            creator: questionResult.u
        },
        reason: req.body.reasons,
        longReason: req.body.longReason,
        reporter: {
            id: reporterData.id,
            username: reporterData.un,
            nickname: reporterData.nn
        }
    }
    await col.poll.updateOne({id: questionResult.id}, {$push: {b: {sus: true}}});
    await col.report.insertOne(data);
    res.redirect('/reportdone');
}