import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import './custom.css'

import Home from './views/Home';
import ScheduledTasks from './views/ScheduledTasks';
import Settings from './views/Settings';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/scheduled-tasks' component={ScheduledTasks} />
        <Route path='/settings' component={Settings} />
      </Layout>
    );
  }
}
