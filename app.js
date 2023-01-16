 

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const flash = require('connect-flash');
const app = express();
const path = require('path');
require('dotenv').config();
const { connect } = require('./tools');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

const limiterLogin = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many login attempts in last 1 minute!'
});

const limiterRegister = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many register attempts in last 1 minute!'
});


app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.json());
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Start All Routes
app.get('/', require('./routes/public/page/home'));
app.get('/home', require('./routes/public/page/home'));

app.get('/about', require('./routes/public/page/about'));

app.get('/news', require('./routes/public/page/news'));

app.get('/api', require('./routes/public/page/api'));
app.get('/api/user', require('./routes/public/api/user'));
app.get('/api/question', require('./routes/public/api/question'));

app.get('/create', require('./routes/public/page/create'));

app.get('/login', require('./routes/public/page/login'));
app.post('/auth/login', limiterLogin, require('./routes/private/auth/login'));

app.get('/register', require('./routes/public/page/register'));
app.post('/auth/register', limiterRegister, require('./routes/private/auth/register'));

app.get('/logout', require('./routes/public/page/logout'));

app.get('/done/questioncreated/:id', require('./routes/public/page/questioncreated'));
app.get('/done/pollcreated/:id', require('./routes/public/page/pollcreated'));

app.get('/questions/:id', require('./routes/public/page/question'));
app.get('/questions/:id/completed', require('./routes/public/page/question-response-completed'));
app.get('/questions/:id/completed/:responseID', require('./routes/public/page/question-response-completed-view'));
app.get('/questions/:id/:responseID', require('./routes/public/page/question-response-view'));
app.post('/api/questions/respond/:id', require('./routes/private/api/question-respond'));
app.post('/api/questions/create', require('./routes/private/api/question-create'));

app.get('/user/:id', require('./routes/public/page/userinfo'));

app.get('/report', require('./routes/public/page/report'));
app.get('/reportdone', require('./routes/public/page/report-done'));
app.post('/privateAPI/report/question', require('./routes/private/api/reportQuestion'));
app.post('/privateAPI/report/questionResponse', require('./routes/private/api/reportQuestionResponse'));
app.post('/privateAPI/report/user', require('./routes/private/api/reportUser'));
app.post('/privateAPI/report/poll', require('./routes/private/api/reportPoll'));

app.get('/admin', require('./routes/public/page/admin'));
app.get('/admin/report/:id', require('./routes/public/page/admin-report'));
app.get('/privateAPI/admin/closeReport', require('./routes/private/api/admin/closeReport'));
app.get('/admin/data/:type/:id', require('./routes/public/page/admin-data'));
app.post('/privateAPI/admin/action/ban', require('./routes/private/api/admin/banUser'));
app.get('/privateAPI/admin/action/delete', require('./routes/private/api/admin/delete'));
app.get('/privateAPI/admin/action/deleteSuspend', require('./routes/private/api/admin/deleteSuspend'));
app.get('/privateAPi/admin/action/unbanUser', require('./routes/private/api/admin/unbanUser'));

app.get('/polls/:id', require('./routes/public/page/poll'));
app.get('/polls/:id/responders/:ch', require('./routes/public/page/poll-stats-responders'));
app.post('/privateAPI/polls/create', require('./routes/private/api/polls-create'));
app.post('/privateAPI/polls/respond/:id', require('./routes/private/api/polls-respond'));

// End

app.use('/', (req, res) => {
    if (req.session.loggedin) href = '/user/me'; else href = 'login';
    if (req.session.loggedin) user = req.session.data.un; else user = 'Not Logged In';
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
});

connect();

if (process.env.PORT) {
    app.listen(process.env.PORT, () => {
        console.log("Ignotum Server Started with port " + process.env.PORT + "!");
    });
} else {
    app.listen(() => {
        console.log("Ignotum Server Started!");
    });
}