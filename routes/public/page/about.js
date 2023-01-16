module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    res.render("about", {
        page: 'About',
        metatitle: 'About Ignotum',
        layout: 'layout/main',
        homeclass: 'null',
        searchclass: 'active',
        apiclass: 'null',
        userclass: 'null',
        href,
        user
    });
}