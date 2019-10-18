import React, { Component } from 'react';
import {Container, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../css/NavMenu.css';

const Burger = (props) => {
  return (
    <div class="burger-button" onClick={props.onClick}>
      <span class="burger-bar" style={{ top: '0%' }}></span>
      <span class="burger-bar" style={{ top: '30%' }}></span>
      <span class="burger-bar" style={{ top: '60%' }}></span>
    </div>
  )
}

export class Nav extends Component {
  static displayName = Nav.name;

  constructor(props) {
    super(props);
  }

  handleClick = ev => {
    console.log("Nav Clicked");
    ev.preventDefault()
    ev.stopPropagation();
    ev.nativeEvent.stopImmediatePropagation();
  }

  render() {
    console.log(this.props.collapsed)
    return (
      <Container>
        <Burger onClick={this.props.toggleNavbar} />

        <nav
          id="nav"
          className={this.props.collapsed ? 'closeNav' : 'openNav'}
          onClick={proxy => proxy.stopPropagation()}
        >
          <h4 class="text-center">Simple Home Automation</h4>
          <NavItem onClick={this.props.toggleNavbar}>
            <NavLink tag={Link} className="" to="/">
              <i class="material-icons">home</i>
              <span>Home</span>
            </NavLink>
          </NavItem>

          <NavItem onClick={this.props.toggleNavbar}>
            <NavLink tag={Link} className="" to="/scheduled-tasks">
              <i class="material-icons">query_builder</i>
              <span>Scheduled Task</span>
            </NavLink>
          </NavItem>

          <NavItem onClick={this.props.toggleNavbar}>
            <NavLink tag={Link} className="" to="/settings">
              <i class="material-icons">settings</i>
              <span>Settings</span>
            </NavLink>
          </NavItem>
        </nav>
      </Container>
    )
  }
}