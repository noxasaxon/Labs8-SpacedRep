/* eslint no-param-reassign: ["error",
{ "props": true, "ignorePropertyModificationsFor": ["x"] }] */

import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import CardInputs from '../SharedComponents/CardInputs';

// Need to make sure all card inputs are completed before submitting
// iterate through all the properties exist on each object
// check to make sure value.length of each is greater than 0

class AddDeck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      // eslint-disable-next-line
      public: false,
      tags: '',
      cards: [{ language: 'Plain Text' }],
    };
  }

  handleChange = ({ e: { preventDefault, target } }) => {
    let val;
    if (target.type === 'checkbox') {
      val = target.checked;
    } else {
      preventDefault();
      val = target.value;
    }
    const { name } = target;
    this.setState({
      [name]: val,
    });
  };

  handleCardChange = (i, name, val) => {
    const { cards } = this.state;
    const updatedCards = [...cards];
    updatedCards[i][name] = val;
    this.setState({
      cards: updatedCards,
    });
  };

  addDeck = (e) => {
    e.preventDefault();
    const { deck, deck: { name, tags, cards } } = this.state;
    const { history } = this.props;
    const deckCards = [...cards];
    const validatedCards = [];
    // validate decks
    if (name.length > 0) {
      deckCards.forEach((card) => {
        if (card.answer && card.question && card.title) validatedCards.push(card);
      });
    }

    if (validatedCards.length > 0) {
      const newDeck = {
        name,
        public: deck.public,
        tags,
      };

      const token = localStorage.getItem('id_token');
      const headers = { Authorization: `Bearer ${token}` };
      axios
        .post(`${process.env.REACT_APP_URL}/api/decks/`, newDeck, { headers })
        .then((response) => {
          // https://eslint.org/docs/rules/no-param-reassign
          validatedCards.forEach((x) => {
            x.deck_id = response.data;
          });
          axios
            .post(`${process.env.REACT_APP_URL}/api/cards/batch`, validatedCards, { headers })
            .then(() => {
              window.location.reload();
              history.push('/dashboard/decks');
            })
            .catch(err => console.log(err.message));
        })
        .catch(error => console.log(error));
      // post request to cards with validatedCards
      this.setState({
        name: '',
        // eslint-disable-next-line
        public: '',
        tags: '',
        cards: [{ language: 'Plain Text' }],
      });
    }
  };

  newCard = () => {
    this.setState(state => ({ cards: [...state.cards, { language: 'Plain Text' }] }));
  };

  removeCard = (index) => {
    const { cards } = this.state;
    // needed to do it this way otherwise React will just erase the array
    // because it thinks you are modifying state directly
    const newCards = [...cards];
    newCards.splice(index, 1);
    this.setState({ cards: newCards });
  };

  render() {
    const { name, tags, cards } = this.state;
    const { toggleAddDeck } = this.props;
    return (
      <AddDeckContainer>
        <Header>
          Create New Deck:
          <Cancel type="button" onClick={toggleAddDeck}>
            x
          </Cancel>
        </Header>
        <DeckForm onSubmit={this.addDeck}>
          <DeckInfo>
            <DeckItem>
              <p>Deck Name</p>
              <input
                type="text"
                value={name}
                name="name"
                onChange={this.handleChange}
                placeholder="Name"
                required
              />
            </DeckItem>
            <DeckItem>
              <p>Tags</p>
              <input
                type="text"
                value={tags}
                name="tags"
                onChange={this.handleChange}
                placeholder="Enter a list of tags separated by comma (no spaces)"
                required
              />
            </DeckItem>

            <SaveButton onClick={this.addDeck}> Save Deck </SaveButton>
          </DeckInfo>
          <Public>
            <p>Enable sharing for this deck?</p>
            <input type="checkbox" name="public" onChange={this.handleChange} />
          </Public>
        </DeckForm>
        {cards.map(x => (
          <CardInputs
            i={x.id}
            key={x.id}
            handleCardChange={this.handleCardChange}
            removeCard={this.removeCard}
          />
        ))}
        <ControlsContainer>
          <AddCard type="button" onClick={this.newCard}>
            Add Another Card
          </AddCard>
          {cards.length > 1 && <SaveButton onClick={this.addDeck}> Save Deck </SaveButton>}
        </ControlsContainer>
      </AddDeckContainer>
    );
  }
}

export default withRouter(AddDeck);

// styles

const AddDeckContainer = styled.div`
align-items: center; */
width: 100%;
height: 100%;
margin: 20px 25px;
padding: 10px;
display: flex;
flex-direction: column;
align-items: flex-start;
background: ${props => props.theme.dark.bodyBackground};
`;

const Header = styled.h2`
display: flex;
width: 100%;
min-height: 46px;
justify-content: space-between;
font-size: 20px;
padding: 10px 0px 10px 0px;
`;

const Cancel = styled.button`
border: none;
background: none;
color: lightgrey;
font-weight: bold;
font-size: 20px;
height: 26px;
margin: 0px;
padding: 0px;
color: ${props => props.theme.dark.buttons.negative};
`;

const DeckForm = styled.div`
display: flex;
flex-direction: column;
width: 100%;
padding: 10px;
min-height: 120px;
background: ${props => props.theme.dark.cardBackground};
border-radius: 3px;
justify-content: space-between;
box-shadow: none;

@media (max-width: 700px) {
  min-height: 270px;
}
`;

const DeckInfo = styled.div`
display: flex;
flex-direction: row;
align-items: center;
width: 100%;
padding: 10px 0;
background: ${props => props.theme.dark.cardBackground};
border-radius: 3px;
justify-content: space-between;
box-shadow: none;

@media (max-width: 700px) {
  flex-direction: column;
  align-items: stretch;
}
`;

const DeckItem = styled.div`
font-size: 18px;
padding-bottom: 2px;
width: 100%;

input {
  width: 80%;

  @media (max-width: 700px) {
    width: 100%;
  }
}
`;

const Public = styled.div`
width: 100%;
display: flex;
align-items: center;

input {
  align-self: center;
  margin: 0px;
  height: 20px;
  width: 20px;
  border-radius: 6px;
  padding: 3px;
}

p {
  color: white;
  padding-right: 10px;
}
`;

const SaveButton = styled.button`
${props => props.theme.dark.buttons.base}
font-size: 16px;
&:hover {
  background: ${props => props.theme.dark.logo};
  color: ${props => props.theme.dark.main};
  cursor: pointer;
}
`;

const AddCard = styled.button`
${props => props.theme.dark.buttons.base}
font-size: 16px;
&:hover {
  background: ${props => props.theme.dark.logo};
  color: ${props => props.theme.dark.main};
  cursor: pointer;
}
`;

const ControlsContainer = styled.div`
display: flex;
width: 100%;
justify-content: space-between;
`;
