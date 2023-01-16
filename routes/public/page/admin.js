const { col } = require('../../../tools');

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    if (!req.session.loggedin) {
        res.redirect('/login?r=admin');
        return;
    }
    let userData = await col.user.findOne({ id: req.session.data.id });
    let amount = await col.data.findOne({ id: 'ignotum' });
    let isAdmin = userData.b.find(x => x.admin);
    if (isAdmin === undefined) {
        isAdmin = {admin: false};
    }
    if (isAdmin.admin === true) {
        res.render('admin', {
            href,
            user,
            page: 'Admin',
            metatitle: 'Ignotum',
            layout: 'layout/main',
            amount,
            alert: req.flash('alert')
        });
        return;
    } else {
        res.render('noAccess', {
            href,
            user,
            page: 'No Access',
            metatitle: 'Ignotum',
            layout: 'layout/main'
        });
        res.status(403);
        return;
    }
}