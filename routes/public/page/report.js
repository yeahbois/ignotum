module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    if (!req.session.loggedin) {
        res.redirect('/login?r=report');
        return;
    }
    res.render('report', {
        page: 'Report',
        metatitle: 'Ignotum Report',
        layout: 'layout/main',
        href,
        user,
        alert: req.flash('alert'),
        account: req.session.data
    });
}