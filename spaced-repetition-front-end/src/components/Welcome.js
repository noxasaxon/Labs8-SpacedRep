import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const Welcome = ({ history }) => {
  const handleWelcomeClick = () => {
    history.push('/dashboard/decks');
  };


  return (
    <DeckViewContainer>
      <WelcomeText>
        <h3>Welcome to SpaceReps!</h3>
        <p>This is a Spaced Repetition memory assistant application.</p>
        <p>
          Click
          {/* Should place Decks inside a button or anchor */}
          <span onClick={handleWelcomeClick}> Decks </span>
          on the sidebar to get started.
        </p>
      </WelcomeText>
    </DeckViewContainer>
  );
};

export default withRouter(Welcome);

// styles

const DeckViewContainer = styled.div`
width: 100%;
height: 100%;
margin-left: 100px;
display: flex;
flex-wrap: wrap;
justify-content: center;
background: ${props => props.theme.dark.bodyBackground};
`;

const WelcomeText = styled.div`
display:flex;
flex-direction: column;
height: 100%;
padding: 20px;

h3 {
  font-size: 22px;
  padding: 10px;
}

p {
  font-size: 18px;
  padding: 10px;
}

span {
  padding-bottom: 10px;
  &:hover {
  border-bottom: 1px solid lightseagreen;
  cursor:pointer;
  }
}
`;
