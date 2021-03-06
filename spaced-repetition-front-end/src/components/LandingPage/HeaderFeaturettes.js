import React from 'react';
import styled from 'styled-components';

const info = [
  { icon: 'fa fa-life-ring fa-3x', title: 'Team Support', description: 'Contact our team whenever you have questions or feedback. We love both!' },
  { icon: 'fas fa-share-square fa-3x', title: 'Deck Sharing', description: 'Make learning collaborative. Share your decks with your peers.' },
  { icon: 'fas fa-code fa-3x', title: 'Code Snippets', description: 'We support Javascript, HTML, CSS, and Python as well as images and markdown.' },
];
// fas fa-share-alt
const HeaderFeaturettes = () => {
  return (
    <Container>
      {info.map(featurette => (
        <Featurette name={featurette.title} key={featurette.title}>
          <h3>{featurette.title}</h3>
          <i className={featurette.icon} aria-hidden="true"></i>
          <p>{featurette.description}</p>
        </Featurette>
      ))}
    </Container>
  );
};

export default HeaderFeaturettes;

// styles

const Container = styled.div`
display: flex;
padding: 0 50px;
justify-content: space-around;
width: 100%;
margin-top: 30px;
height: 200px;

@media( max-width: 650px) {
  font-size: 14px;
}

@media( max-width: 650px) {
  flex-wrap: wrap;
}
`;

const Featurette = styled.div`
width: 255px;
display: flex;
flex-direction: column;
text-align: center;
height: 100%;
margin: 10px;

@media (max-width: 500px) {
  display: ${props => props.name === 'Team Support' ? 'none' : null};
  display: ${props => props.name === 'Code Snippets' ? 'none' : null};
}

h3 {
  margin-bottom: 15px;
}

i {
  color: lightseagreen;
  margin-bottom: 15px;
}

p {
  text-align: left;

  @media (max-width: 600px) {
    font-size: 14px;
  }
}
`;
