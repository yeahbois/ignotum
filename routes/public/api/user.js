const { col } = require('../../../tools');
const moment = require('moment');

module.exports = async (req, res) => {
    let q = req.query;
    if (q.id || q.username) {
        if (q.id) {
            let questions = [];
            let polls = [];
            let result = await col.user.findOne({ id: q.id });
            if (result) {
                for (question of result.q) {
                    let questionData = await col.question.findOne({ id: question });
                    if (questionData.pr === false) {
                        questions.push(questionData.id);
                    }
                }
                for (poll of result.p) {
                    let pollData = await col.poll.findOne({ id: poll });
                    if (pollData.pr === false) {
                        polls.push(pollData.id);
                    }
                }

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

                let isAdmin = result.b.find(x => x.admin);
                if (isAdmin === undefined) {
                    isAdmin = {admin: false};
                }
                isAdmin = isAdmin.admin;

                let data = {
                    id: result.id,
                    username: result.un,
                    nickname: result.nn,
                    questions,
                    polls,
                    admin: isAdmin,
                    banned: userBan,
                    suspended: userSuspend
                }
                res.json(data);
            } else {
                res.json({
                    error: "Not Found"
                });
                res.status(404);
                return;
            }
        }
        if (q.username) {
            let questions = [];
            let polls = [];
            let result = await col.user.findOne({ un: q.username });
            if (result) {
                for (question of result.q) {
                    let questionData = await col.question.findOne({ id: question });
                    if (questionData.pr === false) {
                        questions.push(questionData.id);
                    }
                }

                for (poll of result.p) {
                    let pollData = await col.poll.findOne({ id: poll });
                    if (pollData.pr === false) {
                        polls.push(pollData.id);
                    }
                }

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

                let isAdmin = result.b.find(x => x.admin);
                if (isAdmin === undefined) {
                    isAdmin = {admin: false};
                }
                isAdmin = isAdmin.admin;

                let data = {
                    id: result.id,
                    username: result.un,
                    nickname: result.nn,
                    questions,
                    polls,
                    admin: isAdmin,
                    banned: userBan,
                    suspended: userSuspend
                }
                res.json(data);
            } else {
                res.json({
                    error: "Not Found"
                });
                res.status(404);
                return;
            }
        }
    } else {
        res.json({
            error: "Not Found"
        });
        res.status(404);
        return;
    }
}