import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Nav } from './Nav';

export class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    }
  }

  componentDidMount() {
    let nav = document.getElementById("nav")
    document.body.addEventListener('click', event => {
      let insideClick = nav.contains(event.target);
      if (insideClick) {
        return;
      }

      if (!this.state.collapsed) {
        this.toggleNavbar();
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 27 && !this.state.collapsed){
        this.toggleNavbar();
      }
    }, false)
  }

  toggleNavbar = () => this.setState(prevState => ({ collapsed: !prevState.collapsed }))

  render() {
    return (
      <div>
        <Nav collapsed={this.state.collapsed} toggleNavbar={this.toggleNavbar} />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
