const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { NOT_FOUND } = require('./constants/errors.js');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

app.use((req, res, next) => {
  req.user = {
    _id: '63f758e3af9601702cc38c69'
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

app.listen(PORT, () => { console.log('Hello') });
