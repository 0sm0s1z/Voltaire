/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from './containers/App';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
      <App />
  </Router>
);
