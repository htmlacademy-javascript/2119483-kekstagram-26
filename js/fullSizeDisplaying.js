
import {isEscapeKey} from './utils.js';

const COMMENTS_STEP = 5;
let counter = 1;

const bigPicture = document.querySelector('.big-picture');
const modalOpen = document.querySelector('body');
const closeButton = bigPicture.querySelector('#picture-cancel');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const socialCommentCount = bigPicture.querySelector ('.social__comment-count');
const commentsCountShown = socialCommentCount.querySelector('.comments-count__shown');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCommentTemplate = document.querySelector('#socialComment');
const socialItem = socialCommentTemplate.content.querySelector('li');

function fullSizeDisplay(elem) {
  const {url, description, likes, comments} = elem;
  const bigPictureImg = bigPicture.querySelector('.big-picture__img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  bigPictureImg.querySelector('img').src = url;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  bigPicture.classList.remove('hidden');
  const socialCaption = bigPicture.querySelector('.social__caption');
  socialCaption.textContent = description;
  modalOpen.classList.add('modal-open');
  socialComments.innerHTML = '';

  showComments(comments);
  commentsLoader.addEventListener('click', () => showRestComments(comments));
}

function createCommentsList(arr, item, root) {
  for (let i = 0; i < arr.length; i++) {
    const commentElem = item.cloneNode(true);
    const socialPic = commentElem.querySelector('.social__picture');
    socialPic.src = arr[i].avatar;
    socialPic.alt = arr[i].name;
    const socialText = commentElem.querySelector('.social__text');
    socialText.textContent = arr[i].message;
    root.appendChild(commentElem);
  }
}

function showComments(array) {
  counter = 1;
  socialComments.innerHTML = '';
  if (array.length > COMMENTS_STEP) {
    commentsLoader.classList.remove('hidden');
  }
  createCommentsList(array.slice(0, COMMENTS_STEP), socialItem, socialComments);
  commentsCountShown.textContent = array.length < COMMENTS_STEP ? array.length : COMMENTS_STEP;
}

function showRestComments(array) {
  counter++;
  let restArray = [];
  socialComments.innerHTML = '';
  restArray = array.slice(0, COMMENTS_STEP*counter);
  createCommentsList(restArray, socialItem, socialComments);
  commentsCountShown.textContent = array.length;
  if (restArray.length === array.length){
    commentsLoader.classList.add('hidden');
  }
}

function unActivate() {
  modalOpen.classList.remove('modal-open');
  bigPicture.classList.add('hidden');
}

function fullSizeKeyDown(evt) {
  if (isEscapeKey(evt)) {
    unActivate();
  }
}

window.addEventListener('keydown', fullSizeKeyDown);
closeButton.addEventListener('click', unActivate);

export {fullSizeDisplay, showRestComments};
