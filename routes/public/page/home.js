module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    res.render('home', {
        href,
        user,
        page: 'Home',
        metatitle: 'Ignotum Home',
        layout: 'layout/main',
        homeclass: 'active',
        searchclass: 'null',
        apiclass: 'null',
        userclass: 'null',
        alert: req.flash('alert')
    });
}