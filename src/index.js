import createError from 'http-errors'
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import logger from "./common/logger";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {
    AUTH_E_N,
    COMMENTS_E_N,
    ITEMS_E_N,
    PROFILES_E_N,
    STORAGES_E_N,
    TAGS_E_N,
    USERS_E_N,
    VERSION_E_N
} from "./common/endpointNames";

import versionRouter from './resources/version/router';
import profileRouter from './resources/profile/router';
import itemsRouter from './resources/items/router';
import usersRouter from './resources/users/router';
import storagesRouter from './resources/storages/router';
import commentsRouter from './resources/comments/router';
import tagsRouter from './resources/tags/router';
import authRouter from './resources/auth/router';

const app = express();


app.use(cors());
app.use(morgan('short', {stream: logger.stream}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(process.env.MEDIA_PATH));

app.use(VERSION_E_N, versionRouter);
app.use(PROFILES_E_N, profileRouter);
app.use(ITEMS_E_N, itemsRouter);
app.use(STORAGES_E_N, storagesRouter);
app.use(USERS_E_N, usersRouter);
app.use(COMMENTS_E_N, commentsRouter);
app.use(TAGS_E_N, tagsRouter);
app.use(AUTH_E_N, authRouter);

const swaggerDocument = YAML.load(path.join(__dirname,'./common/swagger.yaml'));
app.use('/', swaggerUi.serve,swaggerUi.setup(swaggerDocument));

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
        logger.error(err.message);
        logger.error(err.stack);
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

export default app;