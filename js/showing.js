import {fullsizeDisplay} from './full-size-displaying.js';
import {getData} from './api.js';
import {getRandomPositiveInteger, debounce} from './utils.js';
import {RANDOM_PIC_AMOUNT, RENDER_DELAY} from './constants.js';

const pictureContainerElement = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture');
const pictureElement = pictureTemplate.content.querySelector('a');
const filtersContainerElement = document.querySelector('.img-filters');
let imagesData = [];

getData(getElems);

function getElems(data) {
  imagesData = data;
  filtersContainerElement.classList.remove('img-filters--inactive');
  filtersContainerElement.addEventListener('click', debounce(imgFilterHandler, RENDER_DELAY));
  showFilteredElems(imagesData);
}

pictureContainerElement.addEventListener('click', (evt) => {
  if (evt.target.parentElement.classList.contains('picture')) {
    fullsizeDisplay(evt.target.parentElement.dataElem);
  }
});

function getRandomValueItems(len) {
  const randomValues = [];
  while (randomValues.length < RANDOM_PIC_AMOUNT ){
    const val = getRandomPositiveInteger(0, len - 1);
    if (!randomValues.includes(val)){
      randomValues.push(val);
    }
  }
  return randomValues;
}

function imgFilterHandler(evt) {
  if (!evt.target.classList.contains('img-filters__button')) {
    return;
  }
  document.querySelector('.img-filters__button.img-filters__button--active').classList.remove('img-filters__button--active');
  evt.target.classList.add('img-filters__button--active');
  let data = [];
  const id = evt.target.id;
  const dataLength = imagesData.length;
  if (id === 'filter-random'){
    const randomValueItems = getRandomValueItems(dataLength);
    data = randomValueItems.map((n) => imagesData[n]);
  }
  else if (id === 'filter-discussed'){
    data = imagesData.slice().sort((a, b ) => b.comments.length - a.comments.length);
  }
  else {
    data = imagesData;
  }
  showFilteredElems(data);
}

function showFilteredElems(data) {
  const picItems = pictureContainerElement.querySelectorAll('.picture');
  const fragment = document.createDocumentFragment();
  picItems.forEach((elem) => elem.remove());
  data.forEach((elem) => {
    const picElem = pictureElement.cloneNode(true);
    picElem.querySelector('.picture__img').src= elem.url;
    picElem.querySelector('.picture__comments').textContent = elem.comments.length;
    picElem.querySelector('.picture__likes').textContent = elem.likes;
    picElem.querySelector('.picture__img').alt = elem.description;
    picElem.dataElem = elem;
    fragment.appendChild(picElem);
  });
  pictureContainerElement.appendChild(fragment);
}
