import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CardInputs from './CardInputs';

// need to limit it so users can only hit save on a card once,
// otherwise they're able to repeatedly duplicate the card on save

// NOTE: cardCount is there to be able to iterate with JSX

// Refactor idea: instead of using cardCount, just add object
// to the cards array and make changes by targeting the index in
// the array. For instance have the onCardSave fn work like handle change
// but take index as param (it's passed to component on creation)
// then you could set state like cards[i].title = val.title. This would also elminate
// the need for a save button when you finish writing a card!

class AddDeck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      public: false,
      tags: '',
      cards: [],
      cardCount: [],
    };
  }

  handleChange = (e) => {
    const { target } = e;
    let val;
    if (target.type === 'checkbox') {
      val = target.checked;
    } else {
      e.preventDefault();
      val = target.value;
    }
    const { name } = target;
    this.setState({
      [name]: val,
    });
  }

  onCardSave = (newCard) => {
    this.setState((state) => {
      return { cards: [...state.cards, newCard] };
    });
  }

  addDeck = (e) => {
    e.preventDefault();
    const deck = this.state;
    const newDeck = {
      name: deck.name,
      public: deck.public,
      tags: deck.tags,
    };
    const deckCards = [...deck.cards];
    // post request to decks with newDeck
    const token = localStorage.getItem('id_token');
    const headers = { Authorization: `Bearer ${token}` };
    axios.post(`${process.env.REACT_APP_URL}/api/decks/`, newDeck, { headers })
      .then((response) => {
        deckCards.forEach((x) => {
          x.deck_id = response.data;
        })
        console.log(deckCards);
        axios.post(`${process.env.REACT_APP_URL}/api/cards/batch`, deckCards, { headers })
          .then((innerResponse) => {
            console.log(innerResponse)
          })
          .catch(err => console.log(err.message));
      })
      .catch(error => (
        this.setState({
          errorMessage: error,
        })
      ));
    // post request to cards with deckCards
    this.setState({
      name: '',
      public: '',
      tags: '',
      cards: [],
    });
  }

  newCard = () => {
    this.setState((state) => {
      return { cardCount: [...state.cardCount, 'another one'] };
    });
  }

  render() {
    const { state } = this;
    return (
      <Container>
        <Headline>Create New Deck:</Headline>
        <AddDeckForm onSubmit={this.addDeck}>
          <input type="text" value={state.name} name="name" onChange={this.handleChange} placeholder="Name" required />
          <PublicDiv> <p style={{ color: 'white' }}>Public?</p>
            <PublicBox type="checkbox" name="public" onChange={this.handleChange} />
          </PublicDiv>

          <input type="text" value={state.tags} name="tags" onChange={this.handleChange} placeholder="Enter a list of tags separated by comma (no spaces)" required />
          <button type="button" onClick={this.newCard}>Add Card</button>
          <button type="submit">Save</button>
        </AddDeckForm>
        {state.cardCount.map((x, i) => {
          return <CardInputs key={i} onCardSave={this.onCardSave} cardNumber={i + 1} />;
        })}
      </Container>
    );
  }
}

export default AddDeck;

// styles
const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  width: 100%;
`

const Headline = styled.h2`
  width:50%;
`

const AddDeckForm = styled.form`
  padding: 20px;
  margin: 5px;
  /* width: 50%; */
  border: 1px solid ${props => props.theme.dark.sidebar};
  background: ${props => props.theme.dark.cardBackground};
  border-radius: 4px;
  min-height: 325px;
`;

const PublicDiv = styled.div`
  display: flex;
  width: 40%;
  justify-content: space-between;
  align-items: center;
`
const PublicBox = styled.input`
  width: 20px;
  margin-top: 8px;
  border-radius: 2px;
`