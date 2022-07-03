
import {isEscapeKey} from './utils.js';

const COMMENTS_STEP = 5;

const bigPicture = document.querySelector('.big-picture');
const modalOpen = document.querySelector('body');
const closeButton = bigPicture.querySelector('#picture-cancel');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const socialCommentCount = bigPicture.querySelector ('.social__comment-count');
const commentsCountShown = socialCommentCount.querySelector('.comments-count__shown');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCommentTemplate = document.querySelector('#socialComment');
const socialItem = socialCommentTemplate.content.querySelector('li');
let handlerRef = '';

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

  if (comments.length <= COMMENTS_STEP){
    commentsCountShown.textContent = comments.length;
    createCommentsList(comments, socialItem, socialComments);
    commentsLoader.classList.add('hidden');
  } else {
    socialComments.innerHTML = '';
    commentsCountShown.textContent = COMMENTS_STEP;
    commentsLoader.classList.remove('hidden');
    createCommentsList(comments.slice(0, COMMENTS_STEP), socialItem, socialComments);
    handlerRef = addOtherComments(comments);
    commentsLoader.addEventListener('click', handlerRef);
  }
}

function addOtherComments(arr) {
  let start = COMMENTS_STEP;
  let end = start + COMMENTS_STEP;
  let newArr = [];
  return function commentsLoadHandler() {
    newArr = arr.slice(start, end);
    if (newArr.length <= COMMENTS_STEP) {
      commentsCountShown.textContent = arr.length;
      commentsLoader.classList.add('hidden');
    } else {
      commentsCountShown.textContent = start;
    }
    createCommentsList(newArr, socialItem, socialComments);
    start += COMMENTS_STEP;
    end += COMMENTS_STEP;
  };
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

closeButton.addEventListener('click', () => {
  modalOpen.classList.remove('modal-open');
  bigPicture.classList.add('hidden');
  commentsLoader.removeEventListener('click', handlerRef);
});

window.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    modalOpen.classList.remove('modal-open');
    bigPicture.classList.add('hidden');
    commentsLoader.removeEventListener('click', handlerRef);
  }});

export {fullSizeDisplay};
