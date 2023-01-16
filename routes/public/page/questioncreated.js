module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    res.render('question-created', {
        page: 'Question Created',
        metatitle: 'Ignotum',
        layout: 'layout/main',
        homeclass: 'null',
        searchclass: 'null',
        apiclass: 'null',
        userclass: 'active',
        href,
        user,
        id: req.params.id
    });
}