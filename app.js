const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { NOT_FOUND } = require('./constants/errors.js');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log('База данных подключена');
  })
  .catch((err) => {
    console.log('Ошибка при подключении базы данных');
    console.error(err);
  });;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  req.user = {
    _id: '63f758e4af9601702cc38c6b'
  };
  next();
});

app.use(usersRouter);
app.use(cardsRouter);

app.use(
  (req, res) => {
    res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
  },
);

app.listen(PORT);