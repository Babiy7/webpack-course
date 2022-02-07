import React from 'react';
import { render } from 'react-dom';
import * as $ from 'jquery';
import Post from 'Modules/Post';
// import css from 'Styles/styles.css';
// import json from 'Assets/json';
import screenshot from 'Assets/Screenshot.png';
import xml from 'Assets/xml.xml';
import csv from 'Assets/anomaly-data-example.csv';
// import less from 'Styles/style.less';
// import sass from 'Styles/style.sass';
// import scss from 'Styles/style.scss';
import './babel';

const post = new Post('Football news', screenshot);

// const image = document.createElement('img');
// image.setAttribute('src', screenshot);

// document.body.appendChild(image);

// const logo = document.getElementsByClassName('logo')[0];
// logo.style.background = `url(${screenshot})`;

// console.log('post', post.toString());
// console.log('json', json);
$('pre').addClass('code').html(post.toString());

console.log('xml', xml);
console.log('csv', csv);

// console.log('logo', logo);

const App = () => (
  <div>
    <h1>Webpack course</h1>
    <div className="logo" />
    <hr />
    <pre />
    <div className="box">
      <h2>Less</h2>
    </div>
    <div className="card-sass">
      <h2>SASS</h2>
    </div>
    <div className="card-scss">
      <h2>SCSS</h2>
    </div>
  </div>
);

render(<App />, document.getElementById('root'));
