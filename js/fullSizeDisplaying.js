
import {isEscapeKey} from './utils.js';
import {COMMENTS_STEP} from './constants.js';

let counter = 1;
let commentsList = [];

const bigPicture = document.querySelector('.big-picture');
const modalOpen = document.querySelector('body');
const closeButton = bigPicture.querySelector('#picture-cancel');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const socialCommentCount = bigPicture.querySelector ('.social__comment-count');
const commentsCountShown = socialCommentCount.querySelector('.comments-count__shown');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCommentTemplate = document.querySelector('#socialComment');
const socialItem = socialCommentTemplate.content.querySelector('li');

commentsLoader.addEventListener('click', showRestComments);

function fullsizeDisplay(elem) {
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

function showComments(comments) {
  counter = 1;
  commentsList = comments;
  socialComments.innerHTML = '';
  if (commentsList.length > COMMENTS_STEP) {
    commentsLoader.classList.remove('hidden');
  }
  createCommentsList(commentsList.slice(0, COMMENTS_STEP), socialItem, socialComments);
  commentsCountShown.textContent = commentsList.length < COMMENTS_STEP ? commentsList.length : COMMENTS_STEP;
}

function showRestComments() {
  counter++;
  const restArray = commentsList.slice(0, COMMENTS_STEP * counter);
  socialComments.innerHTML = '';
  createCommentsList(restArray, socialItem, socialComments);
  commentsCountShown.textContent = restArray.length;
  if (restArray.length === commentsList.length){
    commentsLoader.classList.add('hidden');
  }
}

function disableModal() {
  modalOpen.classList.remove('modal-open');
  bigPicture.classList.add('hidden');
}

function fullSizeKeyDown(evt) {
  if (isEscapeKey(evt)) {
    disableModal();
  }
}

window.addEventListener('keydown', fullSizeKeyDown);
closeButton.addEventListener('click',  disableModal);

export {fullsizeDisplay, showRestComments};
