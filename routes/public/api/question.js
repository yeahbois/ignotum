const { col } = require('../../../tools');

module.exports = async (req, res) => {
    let q = req.query;
    if (q.id) {
        let result = await col.question.findOne({ id: q.id });
        if (result) {
            if (result.pr === false) {
                let suspended = result.b.find(x => x.sus);
                if (suspended === undefined) {
                    suspended = {sus: false};
                }
                let data = {
                    id: result.id,
                    creator: {
                        id: result.u.id,
                        username: result.u.un,
                        nickname: result.u.nn
                    },
                    unreadResponses: result.resp.length,
                    time: result.t,
                    title: result.tit,
                    private: result.pr,
                    suspended: suspended.sus
                }
                res.json(data);
            } else {
                res.json({
                    error: "Not Found"
                });
                res.status(404);
                return;
            }
        } else {
            res.json({
                error: "Not Found"
            });
            res.status(404);
            return;
        }
    } else {
        res.json({
            error: "Not Found"
        });
        res.status(404);
        return;
    }
}