const SRS = require('./algorithm');

//data changes needed:
// Each user will have a unique Progress and DueDate for each card they have access to.
// I suggest we do this one of two ways:
// 1) Progress can be stored as a hashmap with card ids as the keys and each key pointing
//      to an object containing the data for that card/user { dueDate: 17848, progress: 0 }.
//      This hashmap can be stored directly in the user's table under the respective user,
//       eliminating the need for a separate table.
// 2) A Table of UserProgress with UserID as PrimaryKey (redundant but more secure than
//      using Card ID as the PK because then every user would be accessing the same hashmap,
//       searching for their data with UserID as the hashkey)

//Dummy Data
const cards = [
  {
    title: 'SQL card test a',
    question: 'What is SQL?',
    answer: 'structured query language',
    deck_id: 1,
    language: 'Plain Text',
    cardId: 0001
  },
  {
    title: 'React card test a',
    question: 'What is React?',
    answer: 'JS library',
    deck_id: 2,
    language: 'JavaScript',
    cardId: 0002
  },
  {
    title: 'React card test b',
    question: 'Is React declarative?',
    answer: 'Yes',
    deck_id: 2,
    language: 'JavaScript',
    cardId: 0003
  }
];

const decks = [
  {
    name: 'SQL',
    public: false,
    author: 2
  },
  {
    name: 'React',
    public: false,
    author: 2
  },
  {
    name: 'ES6',
    public: false,
    author: 1
  },
  {
    name: 'Chemistry',
    public: false,
    author: 1
  }
];

const users = [
  {
    firstName: 'Drew',
    lastName: 'Smith',
    email: 'drew@drew.com',
    tier: 'free',
    progressData: {
      0001: { dueDate: 17848, progress: 0 },
      0002: { dueDate: 17848, progress: 1 },
      0003: { dueDate: 17848, progress: 0 }
    },
    uuid: 01
  },
  {
    firstName: 'Gabe',
    lastName: 'Smith',
    email: 'gabe@gabe.com',
    tier: 'free'
  },
  {
    firstName: 'Megan',
    lastName: 'Smith',
    email: 'megan@megan.com',
    tier: 'free'
  },
  {
    firstName: 'Saxon',
    lastName: 'Smith',
    email: 'saxon@saxon.com',
    tier: 'free'
  }
];

const userDecks = [
  { user_id: 2, deck_id: 1 },
  { user_id: 2, deck_id: 2 },
  { user_id: 1, deck_id: 3 },
  { user_id: 1, deck_id: 4 },
  { user_id: 3, deck_id: 5 },
  { user_id: 2, deck_id: 5 }, // testing public/shared decks
  { user_id: 4, deck_id: 5 } // testing public/shared decks
];

//get user to test
let user = {};
for (let i = 0; i < users.length; i++) {
  if (users[i].uuid == 001) {
    user = users[i];
    break;
  }
}
console.log(user);

//begin algorithm

//removing these and moving time calls to inside algorithm.js (but outside the class)
// const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
// const today = Math.round(new Date().getTime() / DAY_IN_MILLISECONDS);

//set the amount of days between study sessions
const intervals = [1, 2, 3, 8, 17];

//
const scoreToProgressChange = [-3, -1, 1];

const ms = new SRS(intervals, scoreToProgressChange);

//use this
// const record = ms.getInitialRecord();
// const updatedRecord = ms.calculate(1, record);
const updatedRecord = ms.calculate(1);

console.log(updatedRecord);

console.log(ms.getToday());
