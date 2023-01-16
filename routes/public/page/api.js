module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    res.render('api', {
        page: 'API',
        metatitle: 'Ignotum API',
        layout: 'layout/main',
        href,
        user
    });
}