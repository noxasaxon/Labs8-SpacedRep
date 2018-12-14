const db = require('../../knex.js');
const util = require('util');
const table = 'users';
const decks = require('../decks/decksModel.js');
const cards = require('../cards/cardsModel.js');
const SRS = require('../../algorithm/algorithm');

module.exports = {
  find,
  findByUser,
  createUser,
  updateProgress,
  getAllProgress,
  freeToPaid,
  paidToFree
};

function find() {
  return db(table);
}

function findByUser(id) {
  return db(table).where('user_id', id);
}

function createUser(id) {
  return findByUser(id)
    .then(user => {
      if (user[0]) return user[0];
      else {
        console.log('user not found, creating user');
        return db(table)
          .returning('id')
          .insert({ user_id: id })
          .then(ids => {
            //no user yet, create default deck
            return decks
              .add({
                name: 'Welcome To SpaceReps!',
                public: 'true',
                tags: 'Tutorial',
                author: id
              })
              .then(deckIDs => {
                const ID = deckIDs[0];
                const newCards = [
                  {
                    title: 'Create A Deck',
                    question:
                      'Decks can have tags to easily identify their cards',
                    answer:
                      'Choose to make your deck shareable to enable sharing this deck via link. Or just keep your deck private.',
                    deck_id: ID,
                    language: 'Plain Text'
                  },
                  {
                    title: 'Add Code Snippets to a Card',
                    question:
                      'Use 3 backticks ``` to start and end your code snippet',
                    answer:
                      "```'We support Javascript, CSS, HTML, Python, C++ and more!'```",
                    deck_id: ID,
                    language: 'JavaScript'
                  },
                  {
                    title: 'Training Your Memory',
                    question:
                      'Click the Train Deck button on your deck to initiate Training Mode. The date will be red if a deck is currently due for training. ',
                    answer:
                      'In training mode, cards will display the question before flipping to reveal the answer. If you answer correctly, the card will have a later training date than if you miss the answer.',
                    deck_id: ID,
                    language: 'Plain Text'
                  }
                ];

                return cards
                  .batchAdd(newCards)
                  .then(response => {
                    return ids;
                  })
                  .catch(err => {
                    console.log(err.message);
                  });
              });
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    })
    .catch(err => {
      console.log(err.message);
    });
}

function updateProgress(id, trainingData) {
  // trainingData is an array, looks like [{ difficulty: 0, cardID: 7 }, { difficulty: 1, cardID: 6 }]

  return findByUser(id).then(userArr => {
    const user = userArr[0];

    //instantiate algorithm
    const alg = new SRS();

    if (!user.card_progress) user.card_progress = {};

    trainingData.forEach(card => {
      if (user.card_progress[card.cardID]) {
        // if previous training data exists, use it
        user.card_progress[card.cardID] = alg.calculate(
          card.difficulty,
          user.card_progress[card.cardID]
        );
      } else {
        //if no previous data, initialize it in the algorithm
        user.card_progress[card.cardID] = alg.calculate(card.difficulty);
      }
    });

    //update database and return all card progress for this user "card_progress": JSON.stringify(user.card_progress) }
    return db(table)
      .where({ user_id: user.user_id })
      .update({ card_progress: JSON.stringify(user.card_progress) })
      .then(success => {
        if (!success || success < 1) {
          console.log('failure to update, record not found');
          return false;
        } else {
          return user.card_progress;
        }
      });
  });
}

function getAllProgress(id) {
  return db(table)
    .select('card_progress')
    .where({ user_id: id });
}

function freeToPaid(user_id, customerId) {
  const changes = { tier: 'paid', stripe_customer_id: customerId };
  return db(table)
    .where({ user_id })
    .update(changes)
    .returning('tier');
}

function paidToFree(user_id) {
  const changes = { tier: 'free', stripe_customer_id: null };
  return db(table)
    .where({ user_id })
    .update(changes)
    .returning('tier');
}
