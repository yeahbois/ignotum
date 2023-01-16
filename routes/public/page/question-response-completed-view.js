const { col } = require('../../../tools');
const moment = require('moment');

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    let questionID = req.params.id;
    let responseID = req.params.responseID;
    if (!req.session.loggedin) {
        res.redirect('/login?r=questions/' + questionID + '/completed');
        return;
    }
    const timeConverter = (unix) => {
        let a = new Date(unix).toLocaleString();
        return a;
    }
    const timeSince = (unix) => {
        let a = moment(unix).fromNow();
        return a;
    }
    col.question.findOne({ "id": questionID }, (err, result) => {
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
                col.question.findOne({'id': questionID}, (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        let responseData = result.respCom.find(o => o.id === responseID);
                        let suspended = responseData.b.find(x => x.sus);
                        if (suspended === undefined) {
                            suspended = {sus: false};
                        }
                        suspended = suspended.sus;
                        return res.render("question-view-completed-view", {
                            page: 'View Completed Responses',
                            metatitle: 'Ignotum',
                            layout: 'layout/main',
                            homeclass: 'null',
                            searchclass: 'null',
                            apiclass: 'null',
                            userclass: 'active',
                            href,
                            user,
                            questionData: result,
                            resData: result.respCom.find(o => o.id == responseID),
                            questionTime: {
                                ago: timeSince(result.t),
                                time: timeConverter(result.t)
                            },
                            responseTime: {
                                ago: timeSince(result.respCom.find(o => o.id === responseID).t),
                                time: timeConverter(result.respCom.find(o => o.id === responseID).t)
                            },
                            suspended
                        });
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