import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./workers/interval.worker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

console.log("Creating worker.");
const worker100 = new Worker();
const worker1000 = new Worker();
worker1000.postMessage({"interval": 1000});


worker100.onmessage = function(e) {
    if (e.data === "tick") {
        console.log("tick!");
    }
    else
        console.log("message: " + e.data);
};

worker1000.onmessage = function(e) {
    if (e.data === "tick") {
        console.log("TOCK!");
    }
    else
        console.log("MESSAGE: " + e.data);
};
worker100.postMessage("start");
worker1000.postMessage("start");




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
