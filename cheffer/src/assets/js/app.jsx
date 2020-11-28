import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ReactRegister from './components/ReactRegister';
import LikeButton from './components/LikeButton';
import FollowButton from './components/FollowButton';

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

const reactFollow = document.getElementsByClassName('react-follow');

if (reactFollow) {
  reactFollow.forEach(container => 
    { ReactDOM.render(<FollowButton user ={JSON.parse(container.dataset.user)} userId={JSON.parse(container.dataset.userId)} following={JSON.parse(container.dataset.following)} followed={JSON.parse(container.dataset.followed)}  />, container);
    })
}