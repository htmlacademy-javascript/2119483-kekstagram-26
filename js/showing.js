import {fullSizeDisplay} from './fullSizeDisplaying.js';
import {getData} from './api.js';

const picContainer = document.querySelector('.pictures');
const picTemplate = document.querySelector('#picture');
const picItem = picTemplate.content.querySelector('a');

getData(getElems);

function getElems(data) {
  data.forEach((elem) => {
    const picElem = picItem.cloneNode(true);
    picElem.querySelector('.picture__img').src= elem.url;
    picElem.querySelector('.picture__comments').textContent = elem.comments.length;
    picElem.querySelector('.picture__likes').textContent = elem.likes;
    picElem.querySelector('.picture__img').alt = elem.description;
    picElem.dataElem =  elem;
    picContainer.appendChild(picElem);
  });
}

picContainer.addEventListener('click', (evt) => {
  if (evt.target.parentElement.getAttribute('class') === 'picture') {
    fullSizeDisplay(evt.target.parentElement.dataElem);
  }
});
