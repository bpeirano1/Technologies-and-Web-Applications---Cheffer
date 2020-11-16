import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ReactRegister from './components/ReactRegister';
import LikeButton from './components/LikeButton';

const reactAppContainer = document.getElementById('react-app');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

const reactRegister = document.getElementById('react-register');
 
if (reactRegister) {
  ReactDOM.render(<ReactRegister />, reactRegister);
}

const reactLike = document.getElementsByClassName('react-like');

if (reactLike) {
  reactLike.forEach(container => 
    { ReactDOM.render(<LikeButton publication={JSON.parse(container.dataset.publication)} pub={JSON.parse(container.dataset.pub)} likes={JSON.parse(container.dataset.likes)}/>, container);
    })
}