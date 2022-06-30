
import {isEscapeKey} from './utils.js';

const bigPicture = document.querySelector('.big-picture');
const modalOpen = document.querySelector('body');
modalOpen.classList.add('modal-open');
const closeButton = bigPicture.querySelector('#picture-cancel');

function fullSizeDisplay(elem) {
  const {url, description, likes, comments} = elem;
  const bigPictureImg = bigPicture.querySelector('.big-picture__img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  bigPictureImg.querySelector('img').src = url;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  const socialCommentCount = bigPicture.querySelector ('.social__comment-count');
  socialCommentCount.classList.add('hidden');
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  commentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
  const socialCaption = bigPicture.querySelector('.social__caption');
  socialCaption.textContent = description;
  const socialComments = bigPicture.querySelector('.social__comments');
  const socialCommentTemplate = document.querySelector('#socialComment');
  const socialItem = socialCommentTemplate.content.querySelector('li');

  socialComments.innerHTML = '';

  for (let i = 0; i < comments.length; i++) {
    const commentElem = socialItem.cloneNode(true);
    const socialPic = commentElem.querySelector('.social__picture');
    socialPic.src = comments[i].avatar;
    socialPic.alt = comments[i].name;
    const socialText = commentElem.querySelector('.social__text');
    socialText.textContent = comments[i].message;
    socialComments.appendChild(commentElem);
  }
}

closeButton.addEventListener('click', () => {
  modalOpen.classList.remove('modal-open');
  bigPicture.classList.add('hidden');
});

window.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    modalOpen.classList.remove('modal-open');
    bigPicture.classList.add('hidden');
  }});


export {fullSizeDisplay};

