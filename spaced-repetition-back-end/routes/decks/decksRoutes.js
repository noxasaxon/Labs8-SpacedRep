const express = require('express');
const decks = require('./decksModel.js');
const checkJwt = require('../../jwt');
// const jwtAuthz = require('express-jwt-authz'); <- only needed if we use scopes

const router = express.Router();

router.use(checkJwt);

router.get('/', (req, res) => {
  let user_id = req.user.sub;

  function format(arr) {
    let deckNames = {};
    let formattedData = [];
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      // if deck exists, push just the card to the object's card array
      if (deckNames[arr[i].name] !== undefined) {
        formattedData[deckNames[arr[i].name]].cards.push({
          id: arr[i].id,
          title: arr[i].title,
          question: arr[i].question,
          answer: arr[i].answer,
          language: arr[i].language,
          deck_id: arr[i].deck_id
        });
      } else {
        // if deck does not exist, push the deck to formattedData array
        // add property to deckname objects and assign value of count (for referencing in the array)
        deckNames[arr[i].name] = count++;
        formattedData.push({
          id: arr[i].deck_id,
          name: arr[i].name,
          public: arr[i].public,
          tags: arr[i].tags,
          cards: [
            {
              id: arr[i].id,
              title: arr[i].title,
              question: arr[i].question,
              answer: arr[i].answer,
              language: arr[i].language,
              deck_id: arr[i].deck_id
            }
          ]
        });
      }
    }
    return formattedData;
  }

  decks
    .findByAuthor(user_id)
    .then(decks => {
      console.log(user_id);
      console.log(format(decks));
      res.status(200).json(format(decks));
    })
    .catch(err => res.status(500).json(err));
});

router.post('/', (req, res) => {
  const deck = req.body;
  deck.author = req.user.sub;

  decks
    .add(deck)
    .then(ids => {
      res.status(201).json(ids[0]);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json(err);
    });
});

router.post('/progress', (req, res) => {
  //cardsToUpdate = [{difficulty: '', cardID: ''},{..etc}, ..etc]
  const cardsToUpdate = req.body;
});

router.put('/:id', (req, res) => {
  // console.log('===== REQ', req);
  const { id } = req.params;
  const changes = req.body;

  decks
    .update(id, changes)
    .then(success => {
      if (!success || success < 1) {
        res.status(404).json({ message: 'No records found to update' });
      } else {
        res.status(200).json(success);
      }
    })
    .catch(err => res.status(500).json(err));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  decks
    .remove(id)
    .then(success => {
      if (!success || success < 1) {
        res.status(404).json({ message: 'No records found to delete' });
      } else {
        res.status(200).json(success);
      }
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
