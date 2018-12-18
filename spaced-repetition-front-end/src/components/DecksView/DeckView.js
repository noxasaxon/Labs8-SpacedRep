import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Card from '../SharedComponents/Card';
import CardListTools from '../CardsView/CardListTools'; // make card/deck agnostic?
import AddCard from '../SharedComponents/AddCard';
import Deck from './Deck';
import handleCardSnippets from '../../snippets';


class DeckView extends Component {
  state = {
    addNewCard: false,
    deck: false,
  };

  componentDidMount = () => {
    const { props: { match: { params: { deckId } } } } = this.props;
    const selectedDeckID = deckId;
    const { decks, history } = this.props;
    let match = false;
    for (let i = 0; i < decks.length; i += 1) {
      if (decks[i].id === Number(selectedDeckID)) {
        match = decks[i];
      }
    }
    if (!match) history.push('/dashboard/decks');
    this.setState({ deck: match });
  }

  handleAddCard = () => {
    this.setState(prevState => ({ addNewCard: !prevState.addNewCard }));
  }

  handleDeckData = () => {
    const { decks } = this.props;
    const deckData = decks.map(deck => ({ id: deck.id, name: deck.name }));
    return deckData;
  }

  render() {
    const { today, decks, match: { params: { deckId } } } = this.props;
    const { addNewCard, deck } = this.state;
    const selectedDeckID = deckId;
    return (
      deck
      && (
        <DeckViewContainer>
          <Header>
            <CardListTools addNewCard={this.handleAddCard} />
            <Deck deck={deck} today={today} disableDelete disableTraining />
          </Header>
          <CardsContainer>
            {addNewCard && (
              <AddCard
                grabDeckInfo={this.handleDeckData}
                toggleAddCard={this.handleAddCard}
                deckID={selectedDeckID}
              />
            )}
            {deck.cards.map((card) => {
              const formattedCard = handleCardSnippets(card);
              return (
                <Card
                  key={`${card.id} ${card.title}`}
                  card={formattedCard}
                  deckName={deck.name}
                  decks={decks}
                />
              );
            })}
          </CardsContainer>
        </DeckViewContainer>
      )
      // What are we returning if there isn't a deck?
    );
  }
}

export default withRouter(DeckView);

// styles

const DeckViewContainer = styled.div`
width: 100%;
height: 100%;
margin-left: 100px;
display: flex;
flex-wrap: wrap;
justify-content: center;
background: ${props => props.theme.dark.bodyBackground};
overflow: auto;
padding-bottom: 5%;

@media (max-width: 500px) {
  margin-left: 0;
  margin-top: 65px;
}
`;

const Header = styled.div`
display: flex;
flex-direction:column;
width: 100%;
align-items: center;
`;

const CardsContainer = styled.div`
width: 100%;
display: flex;
flex-wrap: wrap;
justify-content: center;
`;

DeckView.propTypes = {
  decks: PropTypes.instanceOf(Object).isRequired,
};
