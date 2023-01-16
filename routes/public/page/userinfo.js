const { col } = require('../../../tools');
const moment = require('moment');
const poll = require('./poll');

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    if (!req.session.loggedin) {
        return res.redirect('/login?r=' + "user/" + req.params.id);
    }
    if (req.params.id == "me") {
        let questions = [];
        let polls = [];
        let badges = [];
        let userID = req.session.data.id;
        let result = await col.user.findOne({ id: userID });
        if (!result) {
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
        if (result.b.find(b => b.n == "bdg")) {
            for (const badgeResult of result.b.find(b => b.n == "bdg").v) {
                badgeData = await col.badge.findOne({ id: badgeResult });
                badges.push({
                    name: badgeData.nm,
                    icon: badgeData.ic
                });
            }
        }
        for (const question of result.q) {
            questions.push(await col.question.findOne({ id: question }));
        }
        for (const poll of result.p) {
            let pollresult = await col.poll.findOne({ id: poll });
            polls.push(pollresult);
        }
        let isAdmin = result.b.find(x => x.admin);
        if (isAdmin === undefined) {
            isAdmin = {admin: false};
        }
        isAdmin = isAdmin.admin;
        let userData = {
            id: result.id,
            username: result.un,
            nickname: result.nn,
            badges: badges,
            questions: questions,
            polls: polls,
            bonus: result.b,
            responses: result.a,
            isAdmin
        };
        let userBan = result.b.find(x => x.ban);
        if (userBan === undefined) {
            userBan = {ban: false};
        }
        userBan = userBan.ban;
        if (!userBan === false) {
            if (userBan.until <= (moment().unix() * 1000)) {
                await col.user.updateOne({ id: userData.id }, {$pull: {b: {ban: userBan}}});
                userBan = false;
            } 
        }

        let userSuspend = result.b.find(x => x.sus);
        if (userSuspend === undefined) {
            userSuspend = {sus: false};
        }
        userSuspend = userSuspend.sus;
        let bonusData = {
            userBan,
            userSuspend
        }
        return res.render('userdata', {
            page: 'User Data',
            metatitle: 'Ignotum User',
            layout: 'layout/main',
            homeclass: 'null',
            searchclass: 'null',
            apiclass: 'null',
            userclass: 'active',
            href,
            user,
            userData,
            otherUser: false,
            bonusData,
            moment
        });
    } else {
        let questions = [];
        let polls = [];
        let badges = [];
        let result = await col.user.findOne({ un: req.params.id });
        if (!result) {
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
        if (result.b.find(b => b.n === "bdg")) {
            for (const badgeResult of result.b.find(b => b.n === "bdg").v) {
                badgeData = await col.badge.findOne({ id: badgeResult });
                badges.push({
                    name: badgeData.nm,
                    icon: badgeData.ic
                });
            }
        }
        for (const question of result.q) {
            let questionResult = await col.question.findOne({ id: question });
            if (questionResult.pr == false) {
                questions.push(questionResult);
            }
        }
        for (const poll of result.p) {
            let pollresult = await col.poll.findOne({ id: poll });
            if (pollresult.pr == false) {
                polls.push(pollresult);
            }
        }
        let userData = {
            id: result.id,
            username: result.un,
            nickname: result.nn,
            badges: badges,
            questions: questions,
            polls: polls,
            bonus: result.b,
            responses: result.a
        };
        let userBan = result.b.find(x => x.ban);
        if (userBan === undefined) {
            userBan = {ban: false};
        }
        userBan = userBan.ban;
        if (!userBan === false) {
            if (userBan.until <= (moment().unix() * 1000)) {
                await col.user.updateOne({ id: userData.id }, {$pull: {b: {ban: userBan}}});
                userBan = false;
            } 
        }

        let userSuspend = result.b.find(x => x.sus);
        if (userSuspend === undefined) {
            userSuspend = {sus: false};
        }
        userSuspend = userSuspend.sus;
        let bonusData = {
            userBan,
            userSuspend
        }
        return res.render('userdata', {
            page: 'User Data',
            metatitle: 'Ignotum User',
            layout: 'layout/main',
            homeclass: 'null',
            searchclass: 'null',
            apiclass: 'null',
            userclass: 'active',
            href,
            user,
            userData,
            otherUser: true,
            bonusData,
            moment
        });
    }
}