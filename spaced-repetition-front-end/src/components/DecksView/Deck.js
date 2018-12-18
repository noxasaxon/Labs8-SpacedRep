import React from 'react';
import styled, { css } from 'styled-components';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import EditDeck from './EditDeck';

const shareIcon = require('../../images/shareColorized.svg');

// use to convert int date to actual date
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      shareURL: '',
      // eslint throws sharing is not use but is in use
      // eslint-disable-next-line
      sharing: 'false',
    };
  }

  componentDidMount() {
    const { deck } = this.props;
    const endOfUrl = process.env.REACT_APP_REDIRECT.lastIndexOf('/');

    this.setState({
      shareURL: `${process.env.REACT_APP_REDIRECT.substr(0, endOfUrl)}/dashboard/share/deck/${
        deck.id}`,
    });
  }

  handleDeleteDeck = (deckId) => {
    const { history } = this.props;
    const token = localStorage.getItem('id_token');
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .delete(`${process.env.REACT_APP_URL}/api/decks/${deckId}`, { headers })
      .then(() => {
        history.push('/dashboard/decks');
        window.location.reload();
      })
      .catch(error => console.log(error));
  };

  handleEditDeck = (e) => {
    e.stopPropagation();
    this.setState({ isEditing: true });
  };

  toggleEditModeToFalse = () => {
    this.setState({ isEditing: false });
  };

  handleTrain = (e) => {
    e.stopPropagation();
    const { history, deck } = this.props;
    history.push(`/dashboard/decks/${deck.id}/train`);
  };

  handleDeckClick = () => {
    const { history, deck, disableView } = this.props;
    if (disableView) return;
    history.push(`/dashboard/decks/${deck.id}`);
  };

  viewTags = (tagString) => {
    if (!tagString) return undefined;
    const tags = tagString.split(',');
    return tags.map(tag => <Tag key={tag}>{tag}</Tag>);
  };

  handleShare = (e) => {
    const { deck } = this.props;
    const { shareURL } = this.state;
    e.stopPropagation();
    if (document.queryCommandSupported('copy')) {
      const textField = document.createElement('textarea');
      textField.innerText = shareURL;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      alert('Shareable link copied!');
    } else {
      const endOfUrl = process.env.REACT_APP_REDIRECT.lastIndexOf('/');
      alert(
        `Shareable Link: ${process.env.REACT_APP_REDIRECT.substr(
          0,
          endOfUrl,
        )}/dashboard/share/deck/${deck.id}`,
      );
    }
  };

  render() {
    const {
      deck, today, disableTraining, disableDelete, disableEdit, disableShare,
    } = this.props;
    const { isEditing } = this.state;
    return !isEditing
      ? (
        <Container onClick={this.handleDeckClick}>
          <DeckTop>
            <DeckHeader>
              <Title>{deck.name}</Title>
              <NumCards>
                {deck.cards.length === 1 ? `${deck.cards.length} card` : `${deck.cards.length} cards`}
              </NumCards>
            </DeckHeader>
            {!disableShare && (
              <ShareContainer>
                <Share onClick={this.handleShare} src={shareIcon} alt="Share" />
              </ShareContainer>
            )}
            <TagsContainer>
              <TagCaption> Tags: </TagCaption>
              {this.viewTags(deck.tags)}
            </TagsContainer>
          </DeckTop>
          <DeckBottom>
            <TrainingContainer>
              {/* Routes user to deck training component
                which handles all of the training logic and flow. */}
              {!disableTraining && <TrainDeck onClick={this.handleTrain}>Train Deck</TrainDeck>}
              {!disableDelete && (
                <DeleteDeck onClick={() => this.handleDeleteDeck(deck.id)}>Delete</DeleteDeck>
              )}
              {!disableEdit && (
                <TrainDeck onClick={e => this.handleEditDeck(e, deck.id)}>Edit</TrainDeck>
              )}
              {!disableTraining && (
                <DueDateContainer>
                  <DueDate today={today} dueDate={deck.dueDate}>
                    {new Date(deck.dueDate * DAY_IN_MILLISECONDS).toLocaleDateString()}
                  </DueDate>
                  <DateCaption>next training</DateCaption>
                </DueDateContainer>
              )}
            </TrainingContainer>
          </DeckBottom>
        </Container>
      ) : (
        <EditDeck
          deck={deck}
          toggleEditModeToFalse={this.toggleEditModeToFalse}
          deleteDeck={this.handleDeleteDeck}
        />
      );
  }
}

export default withRouter(Deck);

// styles

const Container = styled.div`
padding: 20px 0px 0px 0px;
margin: 20px;
width: 50%;
height: 100%;
border: 1px solid ${props => props.theme.dark.main};
background: ${props => props.theme.dark.cardBackground};
display:flex;
flex-direction: column;
justify-content: space-between;
min-width: 250px;
max-width: 370px;
max-height: 250px;
border-radius: 20px;

&:hover {
  background: #727E86;
  cursor: pointer;
}
`;

const DeckHeader = styled.div`
display: flex;
justify-content: space-between;
padding-bottom: 14px;
`;

const Title = styled.div`
font-size: 25px;
padding-right: 3px;
word-break: break-all;
`;

const NumCards = styled.div`
color: lightgrey;
padding-top: 1px;
`;

const DeckTop = styled.div`
padding: 0px 15px 0px 15px;
`;

const ShareContainer = styled.div`
width: 100%;
display: flex;
justify-content: flex-end;
`;

const Share = styled.img`
color: lightgrey;
height: 35px;
width: 35px;
margin: 1px;
&:hover {
  cursor: pointer;
}
`;

const TagsContainer = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;
padding: 0px;
margin: 0px;
`;

const Tag = styled.div`
padding: 7px 10px 8px 10px;
margin-right: 5px;
background: ${props => props.theme.dark.main};
border-radius: 2px 10px 10px;
`;

const TagCaption = styled.div`
padding: 10px 10px 10px 0px;
color: lightgrey;
`;

const TrainingContainer = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
`;

const TrainDeck = styled.button`
${props => props.theme.dark.buttons.base}
font-size: 16px;
&:hover {
  background: ${props => props.theme.dark.logo};
  color: ${props => props.theme.dark.main};
  cursor: pointer;
}
`;

const DueDateContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: flex-end;
height: 50px;
font-size: 18px;
`;

const DueDate = styled.div`
color: lightgreen;
${props => props.dueDate <= props.today && css`
  color: #ea7075;
`}
`;

const DateCaption = styled.div`
color: lightgrey;
font-size: 17px;
`;

const DeleteDeck = styled(TrainDeck)`
background: ${props => props.theme.dark.buttons.negative};
`;

const DeckBottom = styled.div`
  margin-top: 10px;
  width: 100%;
  padding: 4% 4%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 14px;
  background-color: #2f3d47;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

Deck.propTypes = {
  deck: PropTypes.shape().isRequired,
};
