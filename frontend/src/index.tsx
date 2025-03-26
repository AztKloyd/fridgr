import React from 'react';
import ReactDOM from 'react-dom/client'; // `react-dom/client`로 수정
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// React 18에서는 `createRoot` 사용
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Router>
    <App />
  </Router>
);