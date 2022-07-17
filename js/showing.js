import {fullSizeDisplay} from './fullSizeDisplaying.js';
import {getData} from './api.js';
import {getRandomPositiveInteger, debounce} from './utils.js';
import {RANDOM_PIC_AMOUNT, RENDER_DELAY} from './constants.js';

const picContainer = document.querySelector('.pictures');
const picTemplate = document.querySelector('#picture');
const picItem = picTemplate.content.querySelector('a');
const imgFilters = document.querySelector('.img-filters');
let imgData = [];

getData(getElems);

function getElems(data) {
  imgData = data;
  imgFilters.classList.remove('img-filters--inactive');
  imgFilters.addEventListener('click', debounce(imgFilterHandler, RENDER_DELAY));
  showFilteredElems(imgData);
}

picContainer.addEventListener('click', (evt) => {
  if (evt.target.parentElement.getAttribute('class') === 'picture') {
    fullSizeDisplay(evt.target.parentElement.dataElem);
  }
});

function getRandonValuesArr(len) {
  const arr = [];
  while (arr.length < RANDOM_PIC_AMOUNT ){
    const val = getRandomPositiveInteger(0, len - 1);
    if (!arr.includes(val)){
      arr.push(val);
    } else {
      continue;
    }
  }
  return arr;
}

function imgFilterHandler(evt) {
  if (!evt.target.classList.contains('img-filters__button')) {
    return;
  }
  document.querySelector('.img-filters__button.img-filters__button--active').classList.remove('img-filters__button--active');
  evt.target.classList.add('img-filters__button--active');
  let data = [];
  const dataLength = imgData.length;
  if (evt.target.id === 'filter-random'){
    const randomValuesArr = getRandonValuesArr(dataLength);
    data = randomValuesArr.map((n) => imgData[n]);
  }
  else if (evt.target.id === 'filter-discussed'){
    data = imgData.slice().sort((a, b ) => b.comments.length - a.comments.length);
  }
  else {
    data = imgData;
  }
  showFilteredElems(data);
}

function showFilteredElems(data) {
  const picArr = picContainer.querySelectorAll('a.picture');
  picArr.forEach((elem) => elem.remove());
  data.forEach((elem) => {
    const picElem = picItem.cloneNode(true);
    picElem.querySelector('.picture__img').src= elem.url;
    picElem.querySelector('.picture__comments').textContent = elem.comments.length;
    picElem.querySelector('.picture__likes').textContent = elem.likes;
    picElem.querySelector('.picture__img').alt = elem.description;
    picElem.dataElem = elem;
    picContainer.appendChild(picElem);
  });
}


