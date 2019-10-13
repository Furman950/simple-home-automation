import React, { Component } from 'react';
import { Button } from './widgets/Button';

export class Home extends Component {
  static displayName = Home.name;
  
  render () {
    return (
      <div>
        <Button topic="theTopic" message="testMessage" label="Test button"/>
      </div>
    );
  }
}
