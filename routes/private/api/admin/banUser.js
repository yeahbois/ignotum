 

const { col } = require('./../../../../tools');

module.exports = async (req, res) => {
    let user = await col.user.findOne({ id: req.query.user });
    if (user.un === req.query.admin) {
        req.flash('alert', 'You cannot ban yourself');
        res.redirect('/admin');
        return;
    }
    let userBan = user.b.find(x => x.ban);
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
    if (!userBan === false) {
        req.flash('alert', 'That user already banned!');
        res.redirect('/admin');
        return;
    }
    await col.user.updateOne({ id: req.query.user }, {$push: {b: {
        "ban": {
            reason: req.body.reason,
            longReason: req.body.longReason,
            until: Math.round(new Date(req.body.until).getTime()),
            ra: `${req.body.reporter}/${req.query.admin}`
        }
    }}});
    req.flash('alert', 'Successfully banned ' + user.un);
    res.redirect('/admin');
}