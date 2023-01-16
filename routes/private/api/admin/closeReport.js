 

const { col } = require('../../../../tools');

module.exports = async (req, res) => {
    if (!req.query.id) {
        res.render('404', {
            href,
            user,
            page: '404',
            metatitle: 'Ignotum',
            layout: 'layout/main'
        });
        res.status(404);
        return;
    }
    if (!req.session.loggedin) {
        res.redirect('/login?r=admin/report/' + req.query.id);
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
    let reportData = await col.report.findOne({ id: req.query.id });
    if (!reportData) {
        res.render('404', {
            href,
            user,
            page: '404',
            metatitle: 'Ignotum',
            layout: 'layout/main'
        });
        res.status(404);
        return;
    }
    await col.report.deleteOne({ id: req.query.id });
    await col.data.updateOne({ id: 'ignotum' }, {$pull: {reportIDs: req.query.id}});
    req.flash('alert', 'Successfully remove ' + req.query.id + ' from the report list');
    res.redirect('/admin');
}