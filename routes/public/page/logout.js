module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';

    if (!req.session.loggedin) {
        res.redirect('/login?r=logout');
        return;
    }

    req.session.loggedin = false;
    req.session.data = {
        un: null,
        nn: null
    };

    res.redirect('/');
}