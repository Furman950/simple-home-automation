import React, { Component } from 'react';
import {Container, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../css/navMenu.scss';

const Burger = (props) => {
  return (
    <div className="burger-button" onClick={props.onClick}>
      <span className="burger-bar" style={{ top: '0%' }}></span>
      <span className="burger-bar" style={{ top: '30%' }}></span>
      <span className="burger-bar" style={{ top: '60%' }}></span>
    </div>
  )
}

export class Nav extends Component {
  static displayName = Nav.name;

  constructor(props) {
    super(props);
    this.state = {
      closeNav: ''
    }
  }

  componentDidMount() {
    this.state.closeNav = 'closeNav'
  }

  render() {
    return (
      <Container>
        <Burger onClick={this.props.toggleNavbar} />

        <nav
          id="nav"
          className={this.props.collapsed ? this.state.closeNav : 'openNav'}
        >
          <h4 className="text-center text-color">Simple Home Automation</h4>
          <NavItem onClick={this.props.toggleNavbar}>
            <NavLink tag={Link} className="" to="/">
              <i className="material-icons">home</i>
              <span>Home</span>
            </NavLink>
          </NavItem>

          <NavItem onClick={this.props.toggleNavbar}>
            <NavLink tag={Link} className="" to="/scheduled-tasks">
              <i className="material-icons">query_builder</i>
              <span>Scheduled Task</span>
            </NavLink>
          </NavItem>

          <NavItem onClick={this.props.toggleNavbar}>
            <NavLink tag={Link} className="" to="/settings">
              <i className="material-icons">settings</i>
              <span>Settings</span>
            </NavLink>
          </NavItem>
        </nav>
      </Container>
    )
  }
}