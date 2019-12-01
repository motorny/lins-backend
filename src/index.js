import createError from 'http-errors'
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';

import versionRouter from './resources/version/router';
import profileRouter from './resources/profile/router';
import itemsRouter  from './resources/items/router';
import usersRouter from './resources/users/router';
import storagesRouter from './resources/storages/router';
import commentsRouter from './resources/comments/router';
import tagsRouter from './resources/tags/router';
import authRouter from './resources/auth/router';

const app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/version', versionRouter);
app.use('/profile', profileRouter);
app.use('/items', itemsRouter);
app.use('/storages', storagesRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/tags', tagsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
// Log error and stacktrace if it is 500
// If it is production -> send only messages for 4xx errors
// In development send all messages and stack trace (stack trace for 4xx is useless, so hide it)
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    res.status(status);
    if (status >= 500) {
        console.log(err);
    }
    if (req.app.get('env') === 'development') {
        res.send({
            message: err.message,
            stack: status >= 500 ? err.stack : ''
        });
    } else {
        res.send({message: status >= 500 ? 'Internal server error' : err.message});
    }
});

module.exports = app;