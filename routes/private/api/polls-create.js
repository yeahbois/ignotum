 

const { col, template } = require('../../../tools');

module.exports = async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login?r=polls/create');
        return;
    }
    if (req.body.private) {
        private = true;
    } else {
        private = false;
    }

    if (req.body.choose) {
        choose = true;
    } else {
        choose = false;
    }
    let uploader = {
        id: req.session.data.id,
        un: req.session.data.un,
        nn: req.session.data.nn
    };
    let time = Date.now();
    let title = req.body.question;
    let options = req.body.options.split(/[,]+/);
    if (title.length > 100) {
        req.flash('alert', 'Your question is too long! Max: 100');
        res.redirect('/');
        return;
    }
    if (options.length < 2) {
        req.flash('alert', 'Your option must be 2 or more!');
        res.redirect('/');
        return;
    }
    if (options.length > 20) {
        req.flash('alert', 'Your options is too many! The maximum is 20.');
        res.redirect('/');
        return;
    }

    let set = new Set(options);

    let size = set.size;

    if (options.length != size) {
        req.flash('alert', 'Your options is contain duplicates.');
        res.redirect('/');
        return;
    }

    let respChoices = {};

    let optionsEdited = [];

    options.forEach(e => {
        e = e.trimStart();
        e = e.trimEnd();

        if (e === "") {
            options.splice(options.indexOf(""), 1);
        } else {
            respChoices[e] = [];
            optionsEdited.push(e);
        }
        
    });

    let settings = {
        chooseOne: choose
    }

    let poll = template.poll(uploader, time, title, private, optionsEdited, settings, respChoices);

    await col.poll.insertOne(poll);
    await col.data.updateOne({ id: 'ignotum' }, {$push: {pollIDs: poll.id}});
    await col.user.updateOne({ id: uploader.id }, {$push: {p: poll.id}});
    res.redirect('/done/pollcreated/' + poll.id);
}