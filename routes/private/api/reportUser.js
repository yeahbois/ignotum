 

const { col, reportID } = require('../../../tools');

module.exports = async (req, res) => {
    req.body.userID = req.query.accID;
    let userResult = await col.user.findOne({ un: req.body.username });
    if (!userResult) {
        req.flash('alert', "User Not Found.");
        res.redirect('/report');
        return;
    }
    if (userResult.id === req.body.userID) {
        req.flash('alert', "You cannot report yourself.");
        res.redirect('/report');
        return;
    }
    let reporterData = await col.user.findOne({ id: req.body.userID });
    let isAdmin = userResult.b.find(x => x.admin);
    if (isAdmin === undefined) {
        isAdmin = {admin: false};
    }
    isAdmin = isAdmin.admin;
    let suspended = userResult.b.find(x => x.sus);
    if (suspended === undefined) {
        suspended = {sus: false};
    }
    if (suspended.sus === true) {
        req.flash('alert', "This user is already suspended. Waiting for admin action.");
        res.redirect('/report');
        return;
    }
    let rid = reportID();
    await col.data.updateOne({ id: 'ignotum' }, {$push: {reportIDs: rid}});
    let data = {
        type: "user",
        id: rid,
        user: {
            id: userResult.id,
            username: userResult.un,
            nickname: userResult.nn,
            isAdmin
        },
        reason: req.body.reasons,
        longReason: req.body.longReason,
        reporter: {
            id: reporterData.id,
            username: reporterData.un,
            nickname: reporterData.nn
        }
    }
    await col.user.updateOne({ id: userResult.id }, {$push: {b: {sus:true}}})
    await col.report.insertOne(data);
    res.redirect('/reportdone');
}