const { col } = require('../../../tools');

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
    if (req.params.id === 'list') {
        let data = [];
        let reportIDs = await col.data.findOne({ id: 'ignotum' });
        for (i of reportIDs.reportIDs) {
            data.push(await col.report.findOne({ id: i }));
        }
        res.render('admin-report', {
            href,
            user,
            page: 'Admin',
            metatitle: 'Ignotum Admin',
            layout: 'layout/main',
            alert: req.flash('alert'),
            data
        });
        return;
    }
    let data = await col.report.findOne({ id: req.params.id });
    if (data) {
        if (data.type === 'questionResponse') {
            let questionData = await col.question.findOne({ id: data.question.id });
            let responseData = questionData.resp.find(x => x.id === data.response.id);
            if (responseData === undefined) {
                responseData = {id: 'null'};
            }
            responseData = responseData.id;
            if (responseData === 'null') {
                await col.report.deleteOne({ id: data.id });
                await col.data.updateOne({ id: 'ignotum' }, {$pull: {reportIDs: data.id}});
                res.redirect('/admin/report/list');
                return;
            }
        }
        res.render('admin-report-view', {
            href,
            user,
            page: 'Admin',
            metatitle: 'Ignotum Admin',
            layout: 'layout/main',
            data
        });
    } else {
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
}