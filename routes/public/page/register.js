module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    res.render('register', {
        page: 'Register',
        metatitle: 'Ignotum Register',
        layout: 'layout/main',
        homeclass: 'null',
        searchclass: 'null',
        apiclass: 'null',
        userclass: 'active',
        href,
        user,
        alert: req.flash('alert')
    });
}