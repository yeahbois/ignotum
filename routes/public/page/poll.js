const { col } = require('../../../tools');
const moment = require('moment');

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
    let id = req.params.id;

    if (id === 'create') {
        if (!req.session.loggedin) return res.redirect('/login?r=polls/' + id);
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
        return res.render("poll-create", {
            page: 'Create Poll',
            metatitle: 'Ignotum',
            layout: 'layout/main',
            href,
            user
        });
    }
    let pollData = await col.poll.findOne({ id: id });
    if (!pollData) {
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
    let userID = "";
    if (req.session.loggedin) {
        userID = req.session.data.id;
    } else {
        userID = "null";
    }
    let data = await col.poll.findOne({ id: id });
    if (pollData.u.id === userID) {
        let suspended = data.b.find(x => x.sus);
        if (suspended === undefined) {
            suspended = {sus: false};
        }
        suspended = suspended.sus;
        let xValues = Object.keys(data.respCh);
        let yValues = [];
        xValues.forEach(e => {
            yValues.push(data.respCh[e].length)
        });
        return res.render("poll-view-author", {
            page: 'Poll Statistic',
            metatitle: 'Ignotum Poll',
            layout: 'layout/main',
            href,
            user,
            moment,
            suspended,
            data,
            xValues: Object.keys(data.respCh),
            yValues,
            responder: undefined
        })
    } else {
        if (userID === 'null') {
            let suspended = data.b.find(x => x.sus);
            if (suspended === undefined) {
                suspended = {sus: false};
            }
            suspended = suspended.sus;
            return res.render("poll-view", {
                page: 'View Poll',
                metatitle: 'Ignotum',
                layout: 'layout/main',
                href,
                user,
                logged: req.session.loggedin || false,
                suspended,
                question: data.tit,
                id: data.id,
                options: data.ch,
                alert: req.flash('alert')
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
        let suspended = data.b.find(x => x.sus);
        if (suspended === undefined) {
            suspended = {sus: false};
        }
        suspended = suspended.sus;
        return res.render("poll-view", {
            page: 'View Poll',
            metatitle: 'Ignotum',
            layout: 'layout/main',
            href,
            user,
            logged: req.session.loggedin || false,
            suspended,
            question: data.tit,
            id: data.id,
            options: data.ch,
            alert: req.flash('alert')
        });
    }
}