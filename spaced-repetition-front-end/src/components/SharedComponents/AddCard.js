import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

// need to limit it so users can only hit save on a card once,
// otherwise they're able to repeatedly duplicate the card on save

// NOTE: cardCount is there to be able to iterate with JSX

// Refactor idea: instead of using cardCount, just add object
// to the cards array and make changes by targeting the index in
// the array. For instance have the onCardSave fn work like handle change
// but take index as param (it's passed to component on creation)
// then you could set state like cards[i].title = val.title. This would also elminate
// the need for a save button when you finish writing a card!

class AddCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deckNames: [],
      deck_id: 0,
      title: '',
      question: '',
      answer: '',
      language: '',
      singleDeckView: false,
    };
  }

  componentDidMount() {
    const { grabDeckInfo, deckID } = this.props;

    const deckNames = grabDeckInfo();
    this.setState({ deckNames, deck_id: deckNames[0].id });

    if (deckID) this.setState({ singleDeckView: deckID, deck_id: deckID });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  onCardSave = (event) => {
    event.preventDefault();
    const {
      // disabling eslint here because deck_id is expected server-side
      // eslint-disable-next-line
      title, question, answer, language, deck_id,
    } = this.state;

    const body = {
      // eslint-disable-next-line
      title, question, answer, language, deck_id
    };

    const token = localStorage.getItem('id_token');
    const headers = { Authorization: `Bearer ${token}` };
    axios.post(`${process.env.REACT_APP_URL}/api/cards/`, body, { headers })
      .then(() => {
        window.location.reload();
      })
      .catch(err => console.log(err.message));
  };

  render() {
    const {
      // eslint-disable-next-line
      deckNames, singleDeckView, deck_id, title, question, answer,
    } = this.state;
    const { toggleAddCard } = this.props;
    return (
      <Container>
        <CardInfo>
          <Header>
            <h2>Add New Card:</h2>
            <Caption> Supports code snippets too, just surround code with 3 backticks ``` </Caption>
            <Cancel type="button" onClick={toggleAddCard}>x</Cancel>
          </Header>

          <DescriptionLine>
            <p>Title</p>
          </DescriptionLine>
          <TopRow>
            <input type="text" value={title} name="title" onChange={this.handleChange} placeholder="Title for your new card" required />

          </TopRow>
          <DescriptionLine>
            {!singleDeckView && <Description>Deck </Description>}
            <Description>Language </Description>
          </DescriptionLine>
          <DropdownLine>
            {!singleDeckView && (
              <Dropdown onChange={this.toggleSelectedDecks}>
                {deckNames.map(deck => (
                  <DropdownOption
                    key={deck.name}
                    value={deck.id}
                  >
                    {deck.name}
                  </DropdownOption>
                ))}
              </Dropdown>)
            }
            <Dropdown name="language" onChange={this.handleChange}>
              <DropdownOption value="Plain Text">Plain Text</DropdownOption>
              <DropdownOption value="JavaScript">JavaScript</DropdownOption>
              <DropdownOption value="Python">Python</DropdownOption>
              <DropdownOption value="C++">C++</DropdownOption>
            </Dropdown>
          </DropdownLine>

          <DescriptionLine>
            <Description>Question </Description>
          </DescriptionLine>
          <TextArea type="text" value={question} name="question" onChange={this.handleChange} placeholder="Question to display on this new card" required />

          <DescriptionLine>
            <Description>Answer </Description>
          </DescriptionLine>
          <TextArea type="text" value={answer} name="answer" onChange={this.handleChange} placeholder="Answer to this card's question" required />
          <DropdownLine>
            <Save type="submit" onClick={this.onCardSave}>Add Card</Save>
          </DropdownLine>
        </CardInfo>
      </Container>
    );
  }
}

export default AddCard;

// styles

const Save = styled.button`
width: 100%;
${props => props.theme.dark.buttons.base}
font-size: 16px;
&:hover {
  background: ${props => props.theme.dark.logo};
  color: ${props => props.theme.dark.main};
  cursor: pointer;
}
`;

const Container = styled.div`
width: 100%;
margin: 10px;
h2 {
  font-weight: bold;
}
`;

const Header = styled.div`
display: flex;
justify-content:space-between;
align-items: center;
width: 100%;
margin-bottom: 12px;
font-size: 18px;
`;

const Cancel = styled.button`
border: none;
background: none;
color: lightgrey;
font-weight: bold;
font-size: 24px;
height: 26px;
margin: 0px;
color: ${props => props.theme.dark.buttons.negative};
`;

const DescriptionLine = styled.div`
display:flex;
justify-content:space-between;
font-size: 18px;
padding-bottom: 2px;
`;

const DropdownLine = styled.div`
display:flex;
justify-content:space-between;
padding-bottom: 2px;
font-size: 18px;
`;

const Caption = styled.p`
font-size: 14px;
color: lightgrey;
`;

const TopRow = styled.div`
display: flex;
flex-direction: row;
width: 100%;
background: #5e707b;
border-radius: 3px;
align-items: baseline;
justify-content: space-between;
box-shadow: none;

input[name="title"] {
  flex-grow:1;
}

button, select {
  margin-left: 5px;
}
`;

const CardInfo = styled.div`
display: flex;
flex-direction: column;
width: 100%;
padding: 10px;
background: ${props => props.theme.dark.cardBackground};
border-radius: 3px;
box-shadow: none;
`;

const Description = styled.p`
font-size: 18px;
padding-right: 10px;
`;

const Dropdown = styled.select`
border-radius: 3px;
background-color: lightgray;
border: none;
height: 50px;
width: 30%;
min-width: 100px;
`;

const DropdownOption = styled.option`
background: ${props => props.theme.dark.main};
color: white;
`;

const TextArea = styled.textarea`
height: 75px;
padding: 15px;
resize: vertical;
`;
