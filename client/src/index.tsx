import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import Home from './home';
import Order from './order';
import { Router } from '@reach/router';

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Home default path="/" />
        <Order path="/order"/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
