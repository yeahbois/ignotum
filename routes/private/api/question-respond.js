 

const { col, createResponseID } = require('../../../tools');

module.exports = async (req, res) => {
    let questionID = req.params.id;
    let responder = null;
    if (req.body.name || req.body.name == "on") {
        if (!req.session.loggedin) {
            res.redirect('/login?r=questions/' + questionID);
        }
        responder = {
            id: req.session.data.id,
            un: req.session.data.un,
            nn: req.session.data.nn 
        };
    } else {
        responder = {
            id: "Anonymous",
            un: "Anonymous",
            nn: "Anonymous"
        };
    }
    if (req.body.answer.length > 100) {
        req.flash('alert', 'Your response is too long! Max: 100');
        res.redirect('/');
        return;
    }
    let time = Date.now();
    let response = req.body.answer;
    col.question.findOne({id: questionID}, (err, result) => {
        if (err) console.log(err);
        if (result) {
            let append = {
                "id": createResponseID(questionID).realPass,
                "r": response,
                "u": responder,
                "t": time,
                "b": []
            };
            col.question.updateOne({id: questionID}, {$push: {resp: append}});
            req.flash('alert', `Your response has been added`);
            res.redirect('/');
        }
    });
}