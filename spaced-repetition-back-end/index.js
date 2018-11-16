const express = require('express');
const helmet = require('helmet');
const PORT = process.env.PORT || 4242;
const cors = require('cors');
const usersRoutes = require('./users/usersRoutes');
const stripeRoutes = require('./stripe/stripeRoutes');
const usersRoutes = require('./routes/users/usersRoutes');
const decksRoutes = require('./routes/decks/decksRoutes');
const cardsRoutes = require('./routes/cards/cardsRoutes');

//knex-postgres cheatsheet: https://gist.github.com/laurenfazah/e0b0033cdc40a313d4710cc04e654556

// const { Client } = require('pg');
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });

const server = express();

server.use(express.json(), cors(), helmet());

server.get('/', (req, res) => {
  res.send('Hello friend');
});

server.use('/api/users', usersRoutes);
server.use('/api/purchases', stripeRoutes);
server.use('/api/decks', decksRoutes);
server.use('/api/cards', cardsRoutes);

module.exports = server.listen(PORT, () =>
  console.log(`API running on ${PORT}`)
);

// if (process.env.NODE_ENV !== 'test') {
//   app.use(logger('dev'));
// }
