const { col } = require('../../../tools');
const moment = require('moment');


module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    let id = req.params.id;
    if (id === "create") {
        if (!req.session.loggedin) return res.redirect('/login?r=questions/' + id);
        let result = await col.user.findOne({ id: req.session.data.id });
        let userBan = result.b.find(x => x.ban);
        if (userBan === undefined) {
            userBan = {ban: false};
        }
        userBan = userBan.ban;
        if (!userBan === false) {
            if (userBan.until <= (moment().unix() * 1000)) {
                await col.user.updateOne({ id: result.id }, {$pull: {b: {ban: userBan}}});
                userBan = false;
            } else {
                req.flash('alert', 'You are banned from the Ignotum Service, go to your account page for more information.');
                res.redirect('/');
                return;
            }
        }
        return res.render("question-create", {
            page: 'Create Question',
            metatitle: 'Ignotum',
            layout: 'layout/main',
            homeclass: 'null',
            searchclass: 'null',
            apiclass: 'null',
            userclass: 'active',
            href,
            user
        });
    }
    let questionResult = await col.question.findOne({ id: id });
    if (!questionResult) {
        res.render('404', {
            href,
            user,
            page: '404',
            metatitle: 'Ignotum',
            layout: 'layout/main'
        });
        res.status(404);
        return;
    }
    if (questionResult) {
        let userID = "";
        if (req.session.loggedin) {
            userID = req.session.data.id;
        } else {
            userID = "null";
        }
        if (questionResult.u.id == userID) {
            col.question.findOne({'id': id}, (err, result) => {
                if (err) console.log(err);
                if (result) {
                    let suspended = result.b.find(x => x.sus);
                    if (suspended === undefined) {
                        suspended = {sus: false};
                    }
                    suspended = suspended.sus;
                    return res.render("question-view-author", {
                        page: 'View Answers',
                        metatitle: 'Ignotum',
                        layout: 'layout/main',
                        homeclass: 'null',
                        searchclass: 'null',
                        apiclass: 'null',
                        userclass: 'active',
                        href,
                        user,
                        questions: result.resp,
                        questionID: id,
                        moment,
                        suspended
                    });
                }
            });
        } else {
            if (userID === 'null') {
                let suspended = questionResult.b.find(x => x.sus);
                if (suspended === undefined) {
                    suspended = {sus: false};
                }
                suspended = suspended.sus;
                return res.render("question-view", {
                    id: id,
                    question: questionResult.tit,
                    page: 'View Question',
                    metatitle: 'Ignotum',
                    layout: 'layout/main',
                    homeclass: 'null',
                    searchclass: 'null',
                    apiclass: 'null',
                    userclass: 'active',
                    href,
                    user,
                    logged: req.session.loggedin || false,
                    suspended
                });
            }
            let resultUser = await col.user.findOne({ id: userID });
            let userBan = resultUser.b.find(x => x.ban);
            if (userBan === undefined) {
                userBan = {ban: false};
            }
            userBan = userBan.ban;
            if (!userBan === false) {
                if (userBan.until <= (moment().unix() * 1000)) {
                    await col.user.updateOne({ id: resultUser.id }, {$pull: {b: {ban: userBan}}});
                    userBan = false;
                } else {
                    req.flash('alert', 'You are banned from the Ignotum Service, go to your account page for more information.');
                    res.redirect('/');
                    return;
                }
            }
            let suspended = questionResult.b.find(x => x.sus);
            if (suspended === undefined) {
                suspended = {sus: false};
            }
            suspended = suspended.sus;
            return res.render("question-view", {
                id: id,
                question: questionResult.tit,
                page: 'View Question',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                homeclass: 'null',
                searchclass: 'null',
                apiclass: 'null',
                userclass: 'active',
                href,
                user,
                logged: req.session.loggedin || false,
                suspended
            });
        }
    }
}
    // REWRITE WITH ASYNCHRONOUS, CHECK FOR BAN
    // col.question.findOne({ "id": id }, async (err, result) => {
    //     if (err) console.log(err);
    //     if (!result) {
    //         res.render('404', {
    //             href,
    //             user,
    //             page: '404',
    //             metatitle: 'Ignotum',
    //             layout: 'layout/main',
    //             homeclass: 'null',
    //             searchclass: 'null',
    //             apiclass: 'null',
    //             userclass: 'null'
    //         });
    //         res.status(404);
    //         return;
    //     }
    //     if (result) {
    //         let userID = "";
    //         if (req.session.loggedin) {
    //             userID = req.session.data.id;
    //         } else {
    //             userID = "null";
    //         }
    //         if (result.u.id == userID) {
    //             col.question.findOne({'id': id}, (err, result) => {
    //                 if (err) console.log(err);
    //                 if (result) {
    //                     return res.render("question-view-author", {
    //                         page: 'View Answers',
    //                         metatitle: 'Ignotum',
    //                         layout: 'layout/main',
    //                         homeclass: 'null',
    //                         searchclass: 'null',
    //                         apiclass: 'null',
    //                         userclass: 'active',
    //                         href,
    //                         user,
    //                         questions: result.resp,
    //                         questionID: id,
    //                         moment
    //                     })
    //                 }
    //             });
    //         } else {
    //             if (userID === 'null') {
    //                 return res.render("question-view", {
    //                     id: id,
    //                     question: result.tit,
    //                     page: 'View Question',
    //                     metatitle: 'Ignotum',
    //                     layout: 'layout/main',
    //                     homeclass: 'null',
    //                     searchclass: 'null',
    //                     apiclass: 'null',
    //                     userclass: 'active',
    //                     href,
    //                     user,
    //                     logged: req.session.loggedin || false
    //                 });
    //             }
    //             let resultUser = await col.user.findOne({ id: userID });
    //             let userBan = resultUser.b.find(x => x.ban);
    //             if (userBan === undefined) {
    //                 userBan = {ban: false};
    //             }
    //             userBan = userBan.ban;
    //             if (!userBan === false) {
    //                 if (userBan.until <= (moment().unix() * 1000)) {
    //                     await col.user.updateOne({ id: resultUser.id }, {$pull: {b: {ban: userBan}}});
    //                     userBan = false;
    //                 } else {
    //                     req.flash('alert', 'You are banned from the Ignotum Service, go to your account page for more information.');
    //                     res.redirect('/');
    //                     return;
    //                 }
    //             }
    //             return res.render("question-view", {
    //                 id: id,
    //                 question: result.tit,
    //                 page: 'View Question',
    //                 metatitle: 'Ignotum',
    //                 layout: 'layout/main',
    //                 homeclass: 'null',
    //                 searchclass: 'null',
    //                 apiclass: 'null',
    //                 userclass: 'active',
    //                 href,
    //                 user,
    //                 logged: req.session.loggedin || false
    //             });
    //         }