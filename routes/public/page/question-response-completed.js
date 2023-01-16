const { col } = require('../../../tools');
const moment = require('moment');

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    let id = req.params.id;
    if (!req.session.loggedin) {
        return res.redirect('/login?r=questions/' + id + '/completed');
    }
    col.question.findOne({ "id": id }, (err, result) => {
        if (err) console.log(err);
        if (!result) {
            res.render('404', {
                href,
                user,
                page: '404',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                homeclass: 'null',
                searchclass: 'null',
                apiclass: 'null',
                userclass: 'null'
            });
            res.status(404);
            return;
        }
        if (result) {
            if (result.u.id == req.session.data.id) {
                col.question.findOne({'id': id}, (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        return res.render("question-view-completed", {
                            page: 'View Completed Answers',
                            metatitle: 'Ignotum',
                            layout: 'layout/main',
                            homeclass: 'null',
                            searchclass: 'null',
                            apiclass: 'null',
                            userclass: 'active',
                            href,
                            user,
                            questions: result.respCom,
                            questionID: id,
                            moment,
                            alert: req.flash('alert')
                        })
                    }
                })
            } else {
                res.render('404', {
                    href,
                    user,
                    page: '404',
                    metatitle: 'Ignotum',
                    layout: 'layout/main',
                    homeclass: 'null',
                    searchclass: 'null',
                    apiclass: 'null',
                    userclass: 'null'
                });
                res.status(404);
                return;
            }
        }
    });
}