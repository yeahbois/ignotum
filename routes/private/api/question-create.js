 

const { col, template } = require('../../../tools');

module.exports = async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login?r=questions/create');
        return;
    }
    if (req.body.private) {
        private = true;
    } else {
        private = false;
    }
    if (req.body.question.length >= 100) {
        req.flash('alert', 'Your question is too long! Max: 100');
        res.redirect('/');
        return;
    }
    let uploader = {
        id: req.session.data.id,
        un: req.session.data.un,
        nn: req.session.data.nn
    };
    let time = Date.now();
    let title = req.body.question;

    let question = template.question(uploader, time, title, private);

    await col.question.insertOne(question);
    await col.data.updateOne({ id: 'ignotum' }, {$push: {questionIDs: question.id}});
    await col.user.updateOne({ id: uploader.id }, {$push: {q: question.id}});
    res.redirect('/done/questioncreated/' + question.id);
}