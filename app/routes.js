import React from 'react'
import { Switch, Route } from 'react-router'

import Home from 'components/Home'
import Item from 'components/Item'
import Disclaimer from 'components/Disclaimer'

export default () => (
  <Switch>
    <Route exact strict path="/:mode/:itemId" component={Item} />
    <Route exact strict path="/:mode" component={Home} />
    <Route component={Disclaimer} />
  </Switch>
)
