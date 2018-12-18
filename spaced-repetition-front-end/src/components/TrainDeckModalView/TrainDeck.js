import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import TrainingCard from './TrainingCard';
import handleCardSnippets from '../../snippets';

class TrainDeck extends React.Component {
  state = {
    formattedDeck: [],
  };

  componentDidMount() {
    const { deck, history } = this.props;
    if (!deck) {
      // redirect if props did not load (happens on refresh at trainDeck page)
      history.push('/dashboard/decks');
      return;
    }

    // check all cards to train for code snippets and format them for the Card child component
    const { cards } = deck;
    const formattedDeck = [];
    cards.forEach((card) => {
      const formattedCard = handleCardSnippets(card);
      formattedDeck.push(formattedCard);
    });
    this.setState({ formattedDeck });
  }

  render() {
    const { updateProgress } = this.props;
    const { formattedDeck } = this.state;
    return (
      <TrainingContainer>
        <TrainingCard formattedDeck={formattedDeck} updateProgress={updateProgress} />
      </TrainingContainer>
    );
  }
}

export default withRouter(TrainDeck);

// styles

const TrainingContainer = styled.div`
`;

TrainDeck.defaultProps = {
  deck: null,
};

TrainDeck.propTypes = {
  deck: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  updateProgress: PropTypes.func.isRequired,
};
