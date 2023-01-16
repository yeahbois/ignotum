require('dotenv').config();

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    let redirect = req.query.r;
    if (redirect) {
        res.render('login', {
            redirect: redirect,
            page: 'Login',
            metatitle: 'Ignotum Login',
            layout: 'layout/main',
            homeclass: 'null',
            searchclass: 'null',
            apiclass: 'null',
            userclass: 'active',
            href,
            user,
            alert: req.flash('alert')
        });
    } else res.render('login', {
        redirect: "null",
        page: 'Login',
        metatitle: 'Ignotum Login',
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