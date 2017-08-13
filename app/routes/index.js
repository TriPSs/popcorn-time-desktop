import React from 'react'
import { Switch, Route } from 'react-router'

import homeRoute from './Home'
import itemRoute from './Item'
import disclaimerRoute from './Disclaimer'

export default () => (
  <Switch>
    <Route {...itemRoute} />
    <Route {...homeRoute} />
    <Route {...disclaimerRoute} />
  </Switch>
)
