import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from 'components/Home'
import Item from 'components/Item'

export default () => (
  <Switch>
    <Route exact strict path="/:mode/:itemId" component={Item} />
    <Route exact strict path="/:mode" component={Home} />
    <Redirect to="/movies" />
  </Switch>
)
