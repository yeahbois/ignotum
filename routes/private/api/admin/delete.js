 

const { col } = require("../../../../tools");

module.exports = async (req, res) => {
    if (req.query.type === "question") {
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
        await col.user.updateOne({ id: questionResult.u.id }, {$pull: {q: questionResult.id}});
        await col.data.updateOne({ id: 'ignotum' }, {$pull: {questionIDs: questionResult.id}});
        await col.question.deleteOne({ id: questionResult.id });
        req.flash('alert', 'Successfully delete ' + questionResult.id);
        res.redirect('/admin');
    } else if (req.query.type === "response") {
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
        let responseData = questionResult.resp.find(o => o.id === req.query.response);
        await col.question.updateOne({ id: questionResult.id }, {$pull: {resp: responseData}});
        req.flash('alert', 'Successfully delete ' + questionResult.id + "/" + responseData.id);
        res.redirect('/admin');
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
        if (!poll) {
            res.status(404);
            return;
        }
        let pollresult = await col.poll.findOne({ id: poll });
        await col.user.updateOne({ id: pollresult.u.id }, {$pull: {p: pollresult.id}});
        await col.data.updateOne({ id: 'ignotum' }, {$pull: {pollIDs: pollresult.id}});
        await col.poll.deleteOne({ id: pollresult.id });
        req.flash('alert', 'Successfully delete ' + pollresult.id);
        res.redirect('/admin');
    }
}