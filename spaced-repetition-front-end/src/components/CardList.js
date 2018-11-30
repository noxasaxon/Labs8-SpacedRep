import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CardView from './CardView';
import CardListTools from './CardListTools';

const CardList = ({ decks }) => {
  console.log('decks', decks)
  return (
    <CardContainer>
      <CardListTools />
      {decks.length > 0 && decks.map((deck) => {
        return deck.cards.map(card => <CardView key={card.id} card={card} deckName={deck.name} />);
      })}
      {decks.length === 0 && (
        <div>
          <h3>Hey, it doesn't look like you've made any cards yet!</h3>
          <p>Click the Add Card button in the tool bar above to get started.</p>
        </div>
      )}
    </CardContainer>
  );
};

export default CardList;

// styled

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

CardList.propTypes = {
  decks: PropTypes.instanceOf(Object).isRequired,
};
