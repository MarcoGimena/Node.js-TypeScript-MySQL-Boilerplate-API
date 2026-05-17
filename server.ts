import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';
import errorHandler from './_middleware/error-handler';

const app = express();

console.log("🔥 SERVER IS STARTING");

// 🔥 IMPORTANT: body parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// CORS
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// routes
app.use('/accounts', accountsController);
app.use('/api-docs', swaggerDocs);

// test route
app.get('/test', (req, res) => {
  res.send('API WORKING');
});

// error handler
app.use(errorHandler);

// start server
const port = 4000;
app.listen(port, () => console.log('Server listening on port ' + port));    