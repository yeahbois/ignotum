const { col } = require('../../../tools');
const moment = require('moment');

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    if (!req.session.loggedin) {
        res.redirect('/login?r=admin');
        return;
    }
    let userData = await col.user.findOne({ id: req.session.data.id });
    let isAdmin = userData.b.find(x => x.admin);
    if (isAdmin === undefined) {
        isAdmin = {admin: false};
    }
    if (isAdmin.admin === false) {
        res.render('noAccess', {
            href,
            user,
            page: 'No Access',
            metatitle: 'Ignotum',
            layout: 'layout/main'
        });
        res.status(403);
        return;
    }

    if (req.params.type === 'user') {
        if (req.params.id === 'view') {
            let userIDs = await col.data.findOne({ id: 'ignotum' });
            let userData = [];
            for (userID of userIDs.userIDs) {
                userData.push(await col.user.findOne({ id: userID }));
            }
            res.render('admin-data', {
                href,
                user,
                page: 'Admin',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                type: 'User',
                data: userData
            });
            return;
        } else {
            let data = await col.user.findOne({ id: req.params.id });
            if (!data) {
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
            let isAdmin = data.b.find(x => x.admin);
            let suspended = data.b.find(x => x.sus);
            let banned = data.b.find(x => x.ban);
            if (isAdmin === undefined) {
                isAdmin = {admin: false};
            }
            if (suspended === undefined) {
                suspended = {sus: false};
            }
            if (banned === undefined) {
                banned = {ban: false}
            }
            res.render('admin-data-view', {
                href,
                user,
                page: 'Admin',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                type: 'User',
                data,
                bonusData: {
                    isAdmin: isAdmin.admin,
                    suspended: suspended.sus,
                    banned: banned.ban
                },
                moment,
                admin: req.session.data.un
            });
            return;
        }
        
    } else if (req.params.type === 'response') {
        let QID = req.params.id.split('.')[0];
        let RID = req.params.id.split('.')[1];

        let questionData = await col.question.findOne({ id: QID });
        if (!questionData) {
            res.render('404', {
                href,
                user,
                page: '404',
                metatitle: 'Ignotum',
                layout: 'layout/main',
            });
            res.status(404);
            return;
        }
        let responseData = questionData.resp.find(e => e.id === RID);
        if (!responseData) {
            res.render('404', {
                href,
                user,
                page: '404',
                metatitle: 'Ignotum',
                layout: 'layout/main',
            });
            res.status(404);
            return;
        }
        let suspended = responseData.b.find(x => x.sus);
        if (suspended === undefined) {
            suspended = {sus: false};
        }
        res.render('admin-data-view', {
            href,
            user,
            page: 'Admin',
            metatitle: 'Ignotum',
            layout: 'layout/main',
            type: 'Response',
            moment,
            questionData,
            data: responseData,
            bonusData: {
                sus: suspended.sus
            },
            admin: req.session.data.un
        });
    } else if (req.params.type === 'question') {
        if (req.params.id === 'view') {
            let questionIDs = await col.data.findOne({ id: 'ignotum' });
            let questionData = [];
            for (qID of questionIDs.questionIDs) {
                questionData.push(await col.question.findOne({ id: qID }));
            }
            res.render('admin-data', {
                href,
                user,
                page: 'Admin',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                type: 'Question',
                data: questionData
            });
            return;
        } else {
            let data = await col.question.findOne({ id: req.params.id });
            let suspended = data.b.find(x => x.sus);
            if (suspended === undefined) {
                suspended = {sus: false};
            }
            res.render('admin-data-view', {
                href,
                user,
                page: 'Admin',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                type: 'Question',
                moment,
                data,
                bonusData: {
                    sus: suspended.sus
                },
                admin: req.session.data.un
            });
            return;
        }
    } else if (req.params.type === 'poll') {
        if (req.params.id === 'view') {
            let pollIDs = await col.data.findOne({ id: 'ignotum' });
            let pollData = [];
            for (pID of pollIDs.pollIDs) {
                pollData.push(await col.poll.findOne({ id: pID }));
            }
            res.render('admin-data', {
                href,
                user,
                page: 'Admin',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                type: 'Poll',
                data: pollData
            });
            return;
        } else {
            let data = await col.poll.findOne({ id: req.params.id });
            let suspended = data.b.find(x => x.sus);
            if (suspended === undefined) {
                suspended = {sus: false};
            }
            res.render('admin-data-view', {
                href,
                user,
                page: 'Admin',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                type: 'Poll',
                moment,
                data,
                bonusData: {
                    sus: suspended.sus
                },
                admin: req.session.data.un
            });
            return;
        }
    } else {
        res.render('404', {
            href,
            user,
            page: '404',
            metatitle: 'Ignotum',
            layout: 'layout/main'
        });
        res.status(404);
    }
}