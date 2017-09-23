const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`<!doctype html>
  <html>
    <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Hello Smolny!</h1>
    </body>
  </html>`);
});

app.get('/error', (req, res) => {
  throw Error('Oops!');
});

app.get('/transfer', (req, res) => {
  const {amount, from, to} = req.query;
  res.json({
    result: 'success',
    amount,
    from,
    to
  });
});

// Задание
const cardsJson = './source/cards.json';

app.get('/cards', (req, res) => {
  fs.readFile(cardsJson, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    } else {
      res.send(data);
    }
    // Красиво форматировать!
  });
});

// Добавить проверку на существование карты (обновить баланс),
// Алгоритм Луна
// Доделать удаление
// Покрыть тестами
app.post('/cards', (req, res) => {
  const {cardNumber, balance} = req.query;
  if (cardNumber && balance) {
    // readCards();
    fs.writeFile(cardsJson, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      // res.send(data);
    });
  }
});

app.listen(3000, () => {
  console.log('YM Node School App listening on port 3000!');
});
