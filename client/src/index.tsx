import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import Home from './home';
import Order from './order';
import OrderSummary from './order/order-summary';
import OrderProgress from './order/order-progress';
import { Router } from '@reach/router';

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Home default />
        <Order path="order"/>
        <OrderSummary path="order/summary"/>
        <OrderProgress path="order/progress"/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
