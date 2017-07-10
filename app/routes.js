import React from 'react'
import { Switch, Route } from 'react-router'

import Home from 'components/Home'
import Item from 'components/Item'

export default () => (
  <Switch>
    <Route exact strict path="/item/:activeMode/:itemId" component={Item} />
    <Route exact strict path="/item/:activeMode" component={Home} />
    <Route exact strict path="/" component={Home} />
    <Route exact strict component={Home} />
  </Switch>
)
