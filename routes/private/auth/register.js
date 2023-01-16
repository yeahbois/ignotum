const { col, template } = require('../../../tools');

module.exports = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let nickname = req.body.nickname;

    if (username && password && nickname) {
        let usernamePattern = /^[A-Za-z0-9._]{8,15}$/g;
        let usernameTest = usernamePattern.test(username);
        if (usernameTest === false) {
            req.flash('alert', 'Invalid username!');
            res.redirect('/register');
            return;
        }
        let nicknamePattern = /^[A-Za-z0-9._ ]{8,15}$/g;
        let nicknameTest = nicknamePattern.test(nickname);
        if (nicknameTest === false) {
            req.flash('alert', 'Invalid nickname!');
            res.redirect('/register');
            return;
        }
        let passwordPattern = /^[A-Za-z0-9!@#$%^&*()_+-=\[\]{}|;':",.<>?/~]{8,20}$/g;
        let passwordTest = passwordPattern.test(password);
        if (passwordTest === false) {
            req.flash('alert', 'Invalid password!');
            res.redirect('/register');
            return;
        }
        col.user.findOne({ un: username }, async (err, result) => {
            if (err) console.log(err);
            if (result) {
                req.flash('alert', 'Username already exists');
                res.redirect('/register');
            } else {
                let data = template.user(username, password, nickname);
                await col.data.updateOne({ id: 'ignotum' }, {$push: {userIDs: data.id}});
                col.user.insertOne(data, (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        req.flash('alert', 'Registration successful');
                        res.redirect('/login');
                    } else {
                        req.flash('alert', 'Registration failed');
                        res.redirect('/register');
                    }
                });
            }
        });
    }
}