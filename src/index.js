import ReactDOM from 'react-dom';
import './index.css';

import { renderRoutes } from './routes';

ReactDOM.render(
  renderRoutes(),
  document.getElementById('root')
);
