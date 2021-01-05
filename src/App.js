import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home'
import RegisterPage from './components/pages/RegisterPage'
import ResetPage from './components/pages/ResetPage'
import Contacts from './components/pages/Contacts'
import Profile from './components/pages/Profile'
import Schedule from './components/pages/Schedule'
import Lectures from './components/pages/Lectures'
import Tests from './components/pages/Tests'
import TestPage from './components/pages/TestPage'
import Chat from './components/pages/Chat'
import Support from './components/pages/Support'

export class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/register' component={RegisterPage}/>
          <Route exact path='/reset' component={ResetPage}/>
          <Route exact path='/contacts' component={Contacts}/>
          <Route exact path='/course/profile' component={Profile}/>
          <Route exact path='/course/schedule' component={Schedule}/>
          <Route exact path='/course/lectures' component={Lectures}/>
          <Route exact path='/course/tests' component={Tests}/>
          <Route exact path='/course/tests/:topic' component={TestPage}/>
          <Route exact path='/course/chat' component={Chat}/>
          <Route exact path='/course/support' component={Support}/>
          <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page not found</div>
                )}
              />
          <App />
        </Switch>
      </div>
    )
  }
}

export default App
