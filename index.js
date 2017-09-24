const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const luhn = require('luhn');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (err, req, res, next) {
  console.log('Error middleware worked!');
  console.error(err.stack);
  res.send('Server error happened :(', 500);
});

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

// Вспомогательные функции
const cardsSource = './source/cards.json';

const readCards = (callback) => {
  fs.readFile(cardsSource, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    } else {
      callback(data);
    }
  });
};

const writeCards = (data, result, callback) => {
  fs.writeFile(cardsSource, JSON.stringify(data, null, '  '), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    } else {
      callback(result);
    }
  });
};

const cardExists = (cardsArr, card) => {
  for (let i = 0; i < cardsArr.length; i++) {
    if (cardsArr[i].cardNumber === card) {
      return i + 1; // Вернём порядковый номер в массиве, начиная с 1
    }
  }
  return 0;
};

const rewriteCards = (cardNumber, balance, callback) => {
  let cards, message;
  readCards((data) => {
    cards = JSON.parse(data);
    const index = cardExists(cards, cardNumber);

    if (index > 0) {
      cards[index - 1].balance = balance;
      message = 'Ура! Баланс вашей карты обновлён!';
    } else {
      cards.push({ cardNumber, balance });
      message = 'Ура! ваша карта добавлена!';
    }

    writeCards(cards, message, callback);
  });
};

const deleteCard = (id, callback) => {
  let cards;
  let result = {};
  readCards((data) => {
    cards = JSON.parse(data);

    if (id >= 0 && id < cards.length) {
      cards = cards.filter((elem, ind) => { return ind !== id; });
      result.message = 'Карта успешно удалена!';
      result.code = 200;
    } else {
      result.message = 'Card not found';
      result.code = 404;
    }

    writeCards(cards, result, callback);
  });
};

// Список карт
app.get('/cards', (req, res) => {
  readCards((data) => {
    res.send(data);
  });
});

// Добавление карты/обновление баланса карты
app.post('/cards', (req, res) => {
  const validParams = req.body.cardNumber && req.body.balance && luhn.validate(req.body.cardNumber);
  if (validParams) {
    rewriteCards(req.body.cardNumber, +req.body.balance, (message) => { res.send(message); });
  } else {
    res.sendStatus(400);
  }
});

// Покрыть тестами
app.delete('/cards/:id', (req, res) => {
  deleteCard(+req.params.id, (result) => { res.send(result.message, result.code); });
});

app.listen(3000, () => {
  console.log('YM Node School App listening on port 3000!');
});
