 

const { col } = require('../../../tools');


module.exports = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let redirect = req.query.r;

    if (username && password) {
        col.user.findOne({ un: username, pw: password }, (err, result) => {
            if (result) {
                req.session.loggedin = true;
                req.session.data = {
                    un: result.un,
                    id: result.id,
                    nn: result.nn
                }
                if (redirect == "null") {
                    res.redirect('/');
                } else {
                    res.redirect('/' + redirect);
                }
            } else {
                req.flash('alert', 'Invalid username or password');
                res.redirect('/login?r=' + redirect);
            }
        });
    } else {
        req.flash('alert', 'Please enter username and password');
        res.redirect('/login?r=' + redirect);
    }
}