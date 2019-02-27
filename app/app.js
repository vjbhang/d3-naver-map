const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const searchRouter = require('./routes/searchRouter');


const app = express();
const port = 3001;
// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");
const models = require('./models/index');


// Check DB-Server Connetion
models.sequelize
    .sync()
    .then(() => {
        console.log(' DB 연결 성공');
    })
    .catch(err => {
        console.log(err, '연결 실패');
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);

// Do we need set CORS() and header ?
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.set('Content-Type', 'application/json');
// });

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

app.listen(port, () => {
    console.log('example app listening on port ' + port + '!');
});

module.exports = app;