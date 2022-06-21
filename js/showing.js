import {createObjects} from './data.js';

const picContainer = document.querySelector('.pictures');
const picTemplate = document.querySelector('#picture');
const picItem = picTemplate.content.querySelector('a');

const elems = createObjects();

elems.forEach((elem) => {
  const picElem = picItem.cloneNode(true);
  picElem.querySelector('.picture__img').src= elem.url;
  picElem.querySelector('.picture__comments').textContent = elem.comments[0].length;
  picElem.querySelector('.picture__likes').textContent = elem.likes;
  picContainer.appendChild(picElem);
});
