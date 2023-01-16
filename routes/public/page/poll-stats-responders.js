const { col } = require('../../../tools');
const moment = require('moment');

module.exports = async (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';

    let choices = req.params.ch;
    let poll = req.params.id;
    if (!choices) {
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

    if (!req.session.loggedin) return res.redirect('/login?r=polls/' + poll + '/responders/' + choices);

    let pollData = await col.poll.findOne({ id: poll });
    if (!pollData) {
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
    if (!pollData.u.id === req.session.data.id) {
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
    let data = pollData.respCh[choices];
    if (!data) {
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
    }
    let suspended = pollData.b.find(x => x.sus);
    if (suspended === undefined) {
        suspended = {sus: false};
    }
    suspended = suspended.sus;
    let xValues = Object.keys(pollData.respCh);
    let yValues = [];
    xValues.forEach(e => {
        yValues.push(pollData.respCh[e].length)
    });
    return res.render("poll-view-author", {
        page: 'Poll Statistic',
        metatitle: 'Ignotum Poll',
        layout: 'layout/main',
        href,
        user,
        moment,
        suspended,
        data: pollData,
        xValues: Object.keys(pollData.respCh),
        yValues,
        responder: data
    });
}