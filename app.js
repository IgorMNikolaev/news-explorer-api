require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');

const { DATA_BASE = 'mongodb://localhost:27017/newsdb' } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');

const centralError = require('./middlewares/centralError');
const limiter = require('./utils/limiter');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Max-Age');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
});

app.use('*', cors());

app.use(helmet());
// app.use(limiter);

app.use(requestLogger);
app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(centralError);

app.listen(PORT, () => {
  console.log(` Номер порта:${PORT}`);
});
