/* eslint no-param-reassign: ["error",
{ "props": true, "ignorePropertyModificationsFor": ["x"] }] */

import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Card from './SharedComponents/Card';
import Deck from './DecksView/Deck';
import handleCardSnippets from '../snippets';

class ImportDeck extends Component {
  state = {
    addNewCard: false,
    deck: {
      cards: [],
      dueDate: 0,
      name: 'Default Deck',
    },
  };

  componentDidMount = () => {
    this.retrieveDeck();
  }

  retrieveDeck = () => {
    const { match } = this.props;
    const selectedDeckID = match.params.id;
    if (selectedDeckID) {
      const token = localStorage.getItem('id_token');
      const headers = { Authorization: `Bearer ${token}` };

      axios.get(`${process.env.REACT_APP_URL}/api/decks/${selectedDeckID}`, { headers })
        .then((response) => {
          // assign a dueDate to the deck based on its card with most recent dueDate
          if (response.data && response.data.length > 0) {
            const deck = response.data[0];
            this.setState({ deck });
          }
        })
        .catch(() => (
          this.setState({
            deck: false,
          })
        ));
    }
  }

  handleAddCard = () => {
    const { addNewCard } = this.state;
    this.setState({ addNewCard: !addNewCard });
  }

  handleDeckData = () => {
    const { decks } = this.props;
    const deckData = decks.map(deck => ({ id: deck.id, name: deck.name }));
    return deckData;
  }

  handleImport = () => {
    const {
      deck: {
        name, public: isPublic, tags, cards,
      },
    } = this.state;
    const { history } = this.props;
    const newDeck = {
      name,
      public: isPublic,
      tags,
    };
    const deckCards = [...cards];

    if (cards.length < 1) {
      return;
    }
    // remove unnecessary keys
    const formattedCards = [];
    const requiredKeys = ['answer', 'question', 'language', 'title']; // FIX: add tags when DB supports it
    deckCards.forEach((card) => {
      const formattedCard = {};
      requiredKeys.forEach((key) => {
        formattedCard[key] = card[key];
      });
      formattedCards.push(formattedCard);
    });

    // post request to server with formatted cards
    const token = localStorage.getItem('id_token');
    const headers = { Authorization: `Bearer ${token}` };
    axios.post(`${process.env.REACT_APP_URL}/api/decks/`, newDeck, { headers })
      .then((response) => {
        formattedCards.forEach((x) => {
          x.deck_id = response.data;
        });
        axios.post(`${process.env.REACT_APP_URL}/api/cards/batch`, formattedCards, { headers })
          .then(() => {
          })
          .catch(err => console.log(err.message));

        window.location.reload();
        history.push('/dashboard/decks');
      })
      .catch(() => {
      });
  }

  handleCancel = () => {
    const { history } = this.props;
    history.push('/dashboard/decks');
  }

  render() {
    const { today, decks } = this.props;
    const { deck } = this.state;
    if (deck) {
      return (
        <DeckViewContainer>
          <Header>
            <Instructions>
              <h2>
                Import This Deck?
              </h2>
              <Controls>
                <Import onClick={this.handleImport}> Import Deck </Import>
                <Cancel onClick={this.handleCancel}> Cancel </Cancel>
              </Controls>
            </Instructions>
            <Deck
              deck={deck}
              today={today}
              disableTraining
              disableView
              disableDelete
              disableEdit
              disableShare
            />
          </Header>
          <h1> Cards: </h1>
          <CardsContainer>
            {deck.cards.map((card) => {
              const formattedCard = handleCardSnippets(card);
              return <Card key={`${card.id} ${card.title}`} card={formattedCard} deckName={deck.name} decks={decks} />;
            })}
          </CardsContainer>
        </DeckViewContainer>
      );
    }
    return (
      <DeckViewContainer>
        <Header>
          <Instructions>
            <h2>This Deck is not shareable</h2>
          </Instructions>
        </Header>
      </DeckViewContainer>
    );
  }
}

export default withRouter(ImportDeck);

// styles

const DeckViewContainer = styled.div`
  width: 100%;
  height: 90%;
  background: ${props => props.theme.dark.bodyBackground};
  margin-left: 100px;
  overflow: auto;
  padding-bottom: 5%;
  h1{
    font-size: 25px;
    padding: 15px 15px 0px 15px ;
  }

  @media (max-width: 500px) {
  margin-left: 0;
  margin-top: 65px;
  padding-top: 15px;
  padding-bottom: 90px;
}
`;

const Header = styled.div`
display: flex;
width: 100%;
justify-content: center;
padding-top: 15px;
align-items: center;
flex-wrap:wrap;
`;

const Instructions = styled.div`
display:flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
width: 50%;
height: 154px;
h2 {
font-size: 28px;
font-weight: bold;
border-bottom: 1px solid lightseagreen;
padding: 30px 3px 5px 3px;
}
`;

const Controls = styled.div`
display:flex;
justify-content: space-around;
width: 100%;
`;

const Import = styled.button`
${props => props.theme.dark.buttons.base}
&:hover {
  background: ${props => props.theme.dark.sidebar};
}
`;

const Cancel = styled(Import)`
background: ${props => props.theme.dark.buttons.negative};
width: 128px;
`;

const CardsContainer = styled.div`
width: 100%;
display: flex;
flex-wrap: wrap;
justify-content: center;
`;
