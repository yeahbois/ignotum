module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    res.render('news', {
        href,
        user,
        page: 'Home',
        metatitle: 'Ignotum News',
        layout: 'layout/main',
        alert: req.flash('alert')
    });
}