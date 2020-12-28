require('dotenv').config();
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

app.use(helmet());
app.use(limiter);

app.use(requestLogger);
app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(centralError);

app.listen(PORT, () => {
  console.log(` Номер порта:${PORT}`);
});
