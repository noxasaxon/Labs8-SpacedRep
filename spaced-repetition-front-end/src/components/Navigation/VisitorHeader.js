/* eslint no-confusing-arrow: ["off"] */
// disabling no-confusing-arrow to use styled-components syntax

import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Nav from './Nav';

class VisitorHeader extends Component {
  state = { toggle: false };

  login = () => {
    const { auth } = this.props;
    auth.login();
  }

  logout = () => {
    const { auth } = this.props;
    auth.logout();
  }

  toggleNav = () => {
    const { toggle } = this.state;
    this.setState({ toggle: !toggle });
  }

  /* Conditionally renders "Sign in" or "Sign out" depending on authentication status. */
  render() {
    const { auth } = this.props;
    const { isAuthenticated } = auth;
    const { toggle } = this.state;
    return (
      <Container id="Container" isLoggedIn={isAuthenticated()}>
        <AppName id="AppName" to="/">
          <h1>SpaceReps</h1>
        </AppName>
        <Nav toggle={toggle} login={this.login} logout={this.logout} isLoggedIn={isAuthenticated} />
        <BurgerGroup isLoggedIn={isAuthenticated()}>
          {isAuthenticated() ? <a href="/dashboard">Dashboard</a> : null}
          {toggle
            ? (
              <CloseIcon type="button" onClick={this.toggleNav}>
                <i className="fas fa-times fa-2x" />
              </CloseIcon>
            ) : (
              <BurgerIcon type="button" onClick={this.toggleNav}>
                <i className="fas fa-bars fa-2x" />
              </BurgerIcon>
            )
          }
        </BurgerGroup>
      </Container>
    );
  }
}

export default VisitorHeader;

// styles

const Container = styled.div`
padding: 0 2%;
position: fixed;
z-index: 1;
top: 0;
left: 0;
width: 100%;
max-width: 1500px;
align-items: center;
height: 55px;
display: flex;
justify-content: space-between;
border-bottom: 1px solid white;
background: ${props => props.theme.dark.main};

@media (max-width: 500px) {
height: ${props => props.isLoggedIn ? '90px' : '55px'};
flex-direction: ${props => props.isLoggedIn ? 'column' : 'row'};
justify-content: center;
}

a {
font-size: 16px;

&:hover {
  text-decoration: none;
}
}
`;

const AppName = styled(Link)`
align-self: center;

&:hover {
  text-decoration: none;
}
    
h1 {
  font-family: 'Comfortaa', cursive;
  font-size: 38px;
  font-weight: bold;
}
`;

const BurgerGroup = styled.div`
width: 100%;
max-width: 150px;
justify-content: ${props => props.isLoggedIn ? 'space-between' : 'flex-end'};
align-items: center;
display: none;

@media (max-width: 900px) {
  display: flex;
}

@media (max-width: 500px) {
  max-width: 500px;
}

a {
  display: none;

  @media (max-width: 900px) {
    display: inherit;
  }
}
`;

const BurgerIcon = styled.div`
display: none;

@media (max-width: 900px) {
  display: inline-block;
}
`;

const CloseIcon = styled.div``;

VisitorHeader.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.func.isRequired,
  }).isRequired,
};
