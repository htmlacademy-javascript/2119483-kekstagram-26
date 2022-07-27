
import {isEscapeKey} from './utils.js';
import {COMMENTS_STEP} from './constants.js';

let counter = 1;
let enqueuedComments = [];

const bigPictureElement = document.querySelector('.big-picture');
const bodyElement = document.querySelector('body');
const closeButtonElement = bigPictureElement.querySelector('#picture-cancel');
const moreButtonElement = bigPictureElement.querySelector('.comments-loader');
const socialCommentCountElement = bigPictureElement.querySelector ('.social__comment-count');
const socialCommentCountShownElement = socialCommentCountElement.querySelector('.comments-count__shown');
const socialCommentsListElement = bigPictureElement.querySelector('.social__comments');
const socialCommentTemplate = document.querySelector('#socialComment');
const socialElement = socialCommentTemplate.content.querySelector('li');

function fullsizeDisplay(elem) {
  const {url, description, likes, comments} = elem;
  const bigPictureImg = bigPictureElement.querySelector('.big-picture__img');
  const likesCount = bigPictureElement.querySelector('.likes-count');
  const commentsCount = bigPictureElement.querySelector('.comments-count');
  bigPictureImg.querySelector('img').src = url;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  bigPictureElement.classList.remove('hidden');
  const socialCaption = bigPictureElement.querySelector('.social__caption');
  socialCaption.textContent = description;
  bodyElement.classList.add('modal-open');
  socialCommentsListElement.innerHTML = '';
  showComments(comments);
  moreButtonElement.addEventListener('click', showRestCommentsHandler);
  window.addEventListener('keydown', fullsizeKeydownHandler);
  closeButtonElement.addEventListener('click',  disableModalHandler);
}

function createCommentsList(items, item, root) {
  for (let i = 0; i < items.length; i++) {
    const commentElem = item.cloneNode(true);
    const socialPic = commentElem.querySelector('.social__picture');
    socialPic.src = items[i].avatar;
    socialPic.alt = items[i].name;
    const socialText = commentElem.querySelector('.social__text');
    socialText.textContent = items[i].message;
    root.appendChild(commentElem);
  }
}

function showComments(comments) {
  counter = 1;
  enqueuedComments = comments;
  socialCommentsListElement.innerHTML = '';
  moreButtonElement.classList.toggle('hidden', enqueuedComments.length <= COMMENTS_STEP);
  createCommentsList(enqueuedComments.slice(0, COMMENTS_STEP), socialElement, socialCommentsListElement);
  socialCommentCountShownElement.textContent = enqueuedComments.length < COMMENTS_STEP ? enqueuedComments.length : COMMENTS_STEP;
}

function showRestCommentsHandler() {
  counter++;
  const restComments = enqueuedComments.slice(0, COMMENTS_STEP * counter);
  socialCommentsListElement.innerHTML = '';
  createCommentsList(restComments, socialElement, socialCommentsListElement);
  socialCommentCountShownElement.textContent = restComments.length;
  if (restComments.length === enqueuedComments.length){
    moreButtonElement.classList.add('hidden');
  }
}

function disableModalHandler() {
  bodyElement.classList.remove('modal-open');
  bigPictureElement.classList.add('hidden');
  moreButtonElement.removeEventListener('click', showRestCommentsHandler);
  window.removeEventListener('keydown', fullsizeKeydownHandler);
  closeButtonElement.removeEventListener('click',  disableModalHandler);
}

function fullsizeKeydownHandler(evt) {
  if (isEscapeKey(evt)) {
    disableModalHandler();
  }
}

export {fullsizeDisplay};

