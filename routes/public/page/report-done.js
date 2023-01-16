module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    res.render('report-done', {
        page: 'Report Success',
        metatitle: 'Ignotum Report',
        layout: 'layout/main',
        href,
        user
    });
}