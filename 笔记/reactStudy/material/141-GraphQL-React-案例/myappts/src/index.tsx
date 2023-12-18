import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './06-antdmobile/App';
import App from './03-function+ts/01-state';
import reportWebVitals from './reportWebVitals';

// import './03-function+ts/01-state'

ReactDOM.render(
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
