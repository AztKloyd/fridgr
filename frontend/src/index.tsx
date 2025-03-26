import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './AppRouter'; // AppRouter를 임포트

ReactDOM.render(
  <React.StrictMode>
    <AppRouter /> {/* 라우터 적용 */}
  </React.StrictMode>,
  document.getElementById('root')
);