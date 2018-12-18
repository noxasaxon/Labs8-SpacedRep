/* eslint no-confusing-arrow: ["off"] */
// disabling no-confusing-arrow to use styled-components syntax

import React from 'react';
import PropTypes from 'prop-types';
import Highlight from 'react-highlight.js';
import styled from 'styled-components';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Card extends React.Component {
  state = {
    isEditing: false,
    title: '',
    question: '',
    answer: '',
    language: '',
  };

  componentDidMount = () => {
    const { card } = this.props;
    const {
      answer, question, title, language,
    } = card;
    this.setState({
      answer, question, title, language,
    });
  }


  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  toggleEdit = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
  }

  onCardSave = (event) => {
    event.preventDefault();
    const { card } = this.props;
    const { id } = card;
    const {
      // disabling eslint here because deck_id is expected server-side
      // eslint-disable-next-line
      title, question, answer, language, deck_id,
    } = this.state;

    const body = {
      title, question, answer, language, deck_id,
    };

    const token = localStorage.getItem('id_token');
    const headers = { Authorization: `Bearer ${token}` };
    axios.put(`${process.env.REACT_APP_URL}/api/cards/${id}`, body, { headers })
      .then(() => {
        window.location.reload();
      })
      .catch(err => console.log(err.message));
  };

  handleDeleteCard = (cardID) => {
    const { history } = this.props;
    const token = localStorage.getItem('id_token');
    const headers = { Authorization: `Bearer ${token}` };

    axios.delete(`${process.env.REACT_APP_URL}/api/cards/${cardID}`, { headers })
      .then(response => console.log(response.data))
      .catch(error => console.log(error));

    history.push('/dashboard/cards');
    window.location.reload();
  }

  editCard = () => {
    const {
      title, question, answer,
    } = this.state;
    const { toggleEdit } = this;

    const { card } = this.props;
    return (
      <EditContainer>
        <CardInfo>
          <Header>
            <h2>Edit Card:</h2>
            <Caption> Supports code snippets too, just surround code with 3 backticks ``` </Caption>
            <Cancel type="button" onClick={toggleEdit}>x</Cancel>
          </Header>

          <DescriptionLine>
            <p>Title</p>
          </DescriptionLine>
          <TopRow>
            <input type="text" value={title} name="title" onChange={this.handleChange} placeholder="Title for your new card" required />

          </TopRow>
          <DescriptionLine>
            <Description>Language </Description>
          </DescriptionLine>
          <DropdownLine>
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
            <Save type="submit" onClick={this.onCardSave}>Save Edits</Save>
            <DeleteCard onClick={() => this.handleDeleteCard(card.id)}>Delete Card</DeleteCard>
          </DropdownLine>
        </CardInfo>
      </EditContainer>
    );
  }

  render() {
    const { card, deckName, disableEdit } = this.props;
    const {
      qContentType, aContentType, qFilteredContent, aFilteredContent,
    } = card;
    const tags = ['js', 'css', 'plaintext'];
    const { isEditing } = this.state;
    return (

      isEditing
        ? this.editCard()
        : (
          <CardContainer>
            <CardTop>
              <Title>
                {card.title}
              </Title>
              <Body>
                <BodyGroup>
                  <Label>Question:</Label>

                  {qFilteredContent.map((content, i) => {
                    if (qContentType[i] === 'txt') {
                      return <Text key={`${i + qContentType[i]}`}>{content}</Text>;
                    }
                    return (
                      <Highlight key={`${i + qContentType[i]}`} language={card.language}>
                        {content}
                      </Highlight>
                    );
                  })}
                </BodyGroup>
                <BodyGroup bottom>
                  <Label> Answer: </Label>
                  {aFilteredContent.map((content, i) => {
                    if (aContentType[i] === 'txt') {
                      return <Text spacing key={`${i + qContentType[i]}`}>{content}</Text>;
                    }
                    return (
                      <Highlight key={`${i + qContentType[i]}`} language={card.language}>
                        {content}
                      </Highlight>
                    );
                  })}
                </BodyGroup>
              </Body>
              <TagsLang id="tagslang">
                <List>
                  <Item pb><Label>Language: </Label></Item>
                  <Item>
                    <Tag>
                      {card.language ? card.language : 'none'}
                    </Tag>
                  </Item>
                  <Item pb><Label>Tags: </Label></Item>
                  {tags ? tags.map(tag => <Item key={tag}><Tag>{tag}</Tag></Item>) : null}
                </List>
              </TagsLang>
            </CardTop>
            <CardBottom>
              <FromDeck>
                Belongs to
                {/* The {' '} corrects the spacing issue */}
                {' '}
                <DeckName>{deckName}</DeckName>
                {' '}
                Deck
              </FromDeck>
              {!disableEdit && (
                <EditButton type="button" onClick={this.toggleEdit}>
                  <i className="fas fa-pencil-alt" />
                  edit card
                </EditButton>
              )}
            </CardBottom>
          </CardContainer>
        )
    );
  }
}

export default withRouter(Card);

// styles

const CardContainer = styled.div`
box-shadow: 2px 2px 10px 0px black;
border-radius: 20px;
width: 100%;
max-width: 415px;
margin: 2%;
border: 1px solid ${props => props.theme.dark.main};
background: ${props => props.theme.dark.cardBackground};
`;

const CardTop = styled.div`
width: 100%;
height: 88%;
padding: 4%;
`;

const Title = styled.h2`
height: 10%;
font-size: 22px;
font-weight: bold;
padding-bottom: 10px;
margin-bottom: 4px;
`;

const Body = styled.div`
height: 70%;
display: flex;
flex-direction: column;
justify-content: space-around;
line-height: 1.2;
`;

const BodyGroup = styled.div`
margin-top: ${props => props.bottom ? '10px' : null};

code {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 8px 0;
  background-color: #212b31;
  border-radius: 3px;
  box-shadow: inset 1px 1px 2px black;
}
`;

const Label = styled.h3`
font-weight: bold;
height: 20px;
padding-top: 5px;
letter-spacing: 0.5px;
color: lightgrey;
padding-bottom: 3px;
`;

const Text = styled.p`
`;

const TagsLang = styled.div`
height: 20%;
display: flex;
flex-wrap: wrap;
font-size: 14px;
color: lightgray;
`;

const Item = styled.li`
padding-bottom: ${props => props.pb ? '8px' : null};
`;

const List = styled.ul`
width: 100%;
display: flex;
flex-wrap: wrap;
align-items: flex-end;
justify-content: space-between;
`;

const Tag = styled(Text)`
padding: 7px 10px 8px 10px;
margin-right: 5px;
background: ${props => props.theme.dark.main};
border-radius: 2px 10px 10px;`;

const CardBottom = styled.div`
width: 100%;
height: 12%;
padding: 2% 4%;
display: flex;
justify-content: space-between;
align-items: center;
font-size: 14px;
background-color: #2f3d47;
border-bottom-left-radius: 20px;
border-bottom-right-radius: 20px;
`;

const FromDeck = styled.p`
color: slategray;
`;

const DeckName = styled.span`
color: lightseagreen;
text-decoration: underline;
cursor: pointer;

&:hover {
  color: mediumseagreen;
}
`;

const EditButton = styled.button`
height: 25px;
margin-top: 0;
padding: 0;
text-align: right;
color: lightseagreen;
cursor: pointer;
background-color: transparent;
border: none;

&:hover {
  color: mediumseagreen;
}

i {
  margin-right: 5px;
}
`;

const EditContainer = styled.div`
width: 100%;
max-width: 415px;
border: 1px solid ${props => props.theme.dark.main};
background: ${props => props.theme.dark.cardBackground};
width: 100%;
max-width: 415px;
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

const Save = styled.button`
width: 40%;
${props => props.theme.dark.buttons.base}
font-size: 16px;
&:hover {
  background: ${props => props.theme.dark.logo};
  color: ${props => props.theme.dark.main};
  cursor: pointer;
}
`;

const DeleteCard = styled(Save)`
background: ${props => props.theme.dark.buttons.negative};
&:hover {
color: ${props => props.theme.dark.main};
background: #F7979C;
}
`;

Card.propTypes = {
  card: PropTypes.instanceOf(Object).isRequired,
};
