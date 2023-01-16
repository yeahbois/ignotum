 

const { col } = require('../../../../tools');
const moment = require('moment');

module.exports = async (req, res) => {
    let userID = req.query.user;
    if (!req.session.loggedin) {
        res.redirect('/admin/data/user/' + userID);
        return;
    }
    let request = await col.user.findOne({ id: req.session.data.id });
    let isAdmin = request.b.find(x => x.admin);
    if (isAdmin === undefined) {
        isAdmin = {admin: false};
    }
    if (isAdmin.admin === false) {
        res.json({ error: 'Access Denied!' });
        res.status(403);
        return;
    }
    if (!userID) {
        res.status(404);
        return;
    }
    let userData = await col.user.findOne({ id: userID });
    let userBan = userData.b.find(x => x.ban);
    if (userBan === undefined) {
        userBan = {ban: false};
    }
    userBan = userBan.ban;
    if (!userBan === false) {
        if (userBan.until <= (moment().unix() * 1000)) {
            await col.user.updateOne({ id: userData.id }, {$pull: {b: {ban: userBan}}});
            userBan = false;
        } 
    }
    if (userBan === false) {
        req.flash('alert', 'The user is not banned!');
        res.redirect('/admin');
        return;
    }
    await col.user.updateOne({ id: userData.id }, {$pull: {b: {ban: userBan}}});
    req.flash('alert', 'Successfully unbanned ' + userData.un);
    res.redirect('/admin');
}