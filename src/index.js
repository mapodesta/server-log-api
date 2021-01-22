import '@babel/polyfill';
require('dotenv').config();
import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
// import morgan from 'morgan';
import log from 'fancy-log';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
// import cors from 'cors';
import router from './routes';
import fileUpload from 'express-fileupload';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
// const corsOptions = {
//     credentials: true,
//     origin: "https://covidsn.netlify.app",
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));
// app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// });

// compression and header security middleware
app.use(compression());
app.use(helmet());
// app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.status(200).send({ msg: "Welcome" })
});

app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(expressValidator());
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        meta: false,
        expressFormat: true,
        colorize: true,
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
);

app.use('/public', express.static(`${__dirname}/public`));
app.use(router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Resource does not exist');
    console.log(err)
    err.status = 404;
    next(err);
});

if (!isProduction) {
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        log(err.stack);
        res.status(err.status || 500).json({
            error: {
                message: err.message,
                error: err,
            },
            status: false,
        });
    });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    return res.status(err.status || 500).json({
        error: {
            message: err.message,
            error: {},
        },
        status: false,
    });
});

// configure port and listen for requests
const port = process.env.PORT || 8080;
export const server = app.listen(port, () => {
    log(`Server is running on http://localhost:${port} `);
});

export default app;