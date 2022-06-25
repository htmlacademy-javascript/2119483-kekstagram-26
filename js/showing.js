import {createObjects} from './data.js';
import {fullSizeDisplay} from './fullSizeDisplaying.js';

const picContainer = document.querySelector('.pictures');
const picTemplate = document.querySelector('#picture');
const picItem = picTemplate.content.querySelector('a');
const elems = createObjects();

elems.forEach((elem) => {
  const picElem = picItem.cloneNode(true);
  picElem.querySelector('.picture__img').src= elem.url;
  picElem.querySelector('.picture__comments').textContent = elem.comments.length;
  picElem.querySelector('.picture__likes').textContent = elem.likes;
  picElem.addEventListener('click', () => {
    fullSizeDisplay(elem);
  });
  picContainer.appendChild(picElem);
});

