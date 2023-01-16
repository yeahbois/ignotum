 

const { col } = require('../../../../tools');

module.exports = async (req, res) => {
    if (req.query.type === 'user') {
        let userID = req.query.user;
        if (!req.session.loggedin) {
            res.redirect('/admin/data/user/' + userID);
            return;
        }
        let request = await col.user.findOne({ id: req.session.data.id });
        let isAdmin = request.b.find(x => x.admin);
        if (isAdmin === undefined) {
            isAdmin = {admin: false};
        }
        if (isAdmin.admin === false) {
            res.json({ error: 'Access Denied!' });
            res.status(403);
            return;
        }
        if (!userID) {
            res.status(404);
            return;
        }
        let userData = await col.user.findOne({ id: userID });
        let userSus = userData.b.find(x => x.sus);
        if (userSus === undefined) {
            userSus = {sus: false};
        }
        userSus = userSus.sus;
        if (userSus === false) {
            req.flash('alert', 'The user is not suspended!');
            res.redirect('/admin');
            return;
        }
        await col.user.updateOne({ id: userData.id }, {$pull: {b: {sus: true}}});
        req.flash('alert', 'Successfully remove ' + userData.un + " suspend");
        res.redirect('/admin');
        return;
    } else if (req.query.type === 'question') {
        let questionID = req.query.question;
        if (!req.session.loggedin) {
            res.redirect('/admin/data/question/' + questionID);
            return;
        }
        let request = await col.user.findOne({ id: req.session.data.id });
        let isAdmin = request.b.find(x => x.admin);
        if (isAdmin === undefined) {
            isAdmin = {admin: false};
        }
        if (isAdmin.admin === false) {
            res.json({ error: 'Access Denied!' });
            res.status(403);
            return;
        }
        let questionResult = await col.question.findOne({ id: questionID });
        let userSus = questionResult.b.find(x => x.sus);
        if (userSus === undefined) {
            userSus = {sus: false};
        }
        userSus = userSus.sus;
        if (userSus === false) {
            req.flash('alert', 'The question is not suspended!');
            res.redirect('/admin');
            return;
        }
        await col.question.updateOne({ id: questionResult.id }, {$pull: {b: {sus: true}}});
        req.flash('alert', 'Successfully remove ' + questionResult.id + " suspend");
        res.redirect('/admin');
        return;
    } else if (req.query.type === 'response') {
        let questionID = req.query.question;
        if (!req.session.loggedin) {
            res.redirect('/admin/data/question/' + questionID);
            return;
        }
        let request = await col.user.findOne({ id: req.session.data.id });
        let isAdmin = request.b.find(x => x.admin);
        if (isAdmin === undefined) {
            isAdmin = {admin: false};
        }
        if (isAdmin.admin === false) {
            res.json({ error: 'Access Denied!' });
            res.status(403);
            return;
        }
        if (!questionID) {
            res.status(404);
            return;
        }
        let questionResult = await col.question.findOne({ id: questionID });
        let questionResp = questionResult.resp;
        let responseData = questionResp.find(o => o.id === req.query.response);
        let responseIndex = questionResp.indexOf(responseData);
        let susIndex = responseData.b.indexOf({sus: true});
        responseData.b.splice(susIndex, 1);
        questionResp.splice(responseIndex, 1, responseData);
        await col.question.updateOne({ id: questionResult.id }, {$set: {resp: questionResp}});
        req.flash('alert', 'Successfully remove ' + questionResult.id + "/" + responseData.id + " suspend");
        res.redirect('/admin');
        return;
    } else if (req.query.type === 'poll') {
        let poll = req.query.poll;
        if (!req.session.loggedin) {
            res.redirect('/admin/data/poll/' + poll);
            return;
        }
        let request = await col.user.findOne({ id: req.session.data.id });
        let isAdmin = request.b.find(x => x.admin);
        if (isAdmin === undefined) {
            isAdmin = {admin: false};
        }
        if (isAdmin.admin === false) {
            res.json({ error: 'Access Denied!' });
            res.status(403);
            return;
        }
        let pollResult = await col.poll.findOne({ id: poll });
        let pollSus = pollResult.b.find(x => x.sus);
        if (pollSus === undefined) {
            pollSus = {sus: false};
        }
        pollSus = pollSus.sus;
        if (pollSus === false) {
            req.flash('alert', 'The poll is not suspended!');
            res.redirect('/admin');
            return;
        }
        await col.poll.updateOne({ id: pollResult.id }, {$pull: {b: {sus: true}}});
        req.flash('alert', 'Successfully remove ' + pollResult.id + " suspend");
        res.redirect('/admin');
        return;
    }
}