
function fullSizeDisplay(elem) {
  const bigPicture = document.querySelector('.big-picture');
  const bigPictureImg = bigPicture.querySelector('.big-picture__img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  bigPictureImg.querySelector('img').src = elem.url;
  likesCount.textContent = elem.likes;
  commentsCount.textContent = elem.comments.length;
  const socialCommentCount = bigPicture.querySelector ('.social__comment-count');
  socialCommentCount.classList.add('hidden');
  const commentsLoader = bigPicture.querySelector('.comments-loader');
  commentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
  const socialCaption = bigPicture.querySelector('.social__caption');
  socialCaption.textContent = elem.description;
  const modalOpen = document.querySelector('body');
  modalOpen.classList.add('modal-open');
  const closeButton = bigPicture.querySelector('#picture-cancel');
  const socialComments = bigPicture.querySelector('.social__comments');
  const socialCommentTemplate = document.querySelector('#socialComment');
  const socialItem = socialCommentTemplate.content.querySelector('li');
  const oldComments = socialComments.querySelectorAll('li');

  for (const comment of oldComments) {
    socialComments.removeChild(comment);
  }

  for (let i = 0; i < elem.comments.length; i++) {
    const commentElem = socialItem.cloneNode(true);
    const socialPic = commentElem.querySelector('.social__picture');
    socialPic.src = elem.comments[i].avatar;
    socialPic.alt = elem.comments[i].name;
    const socialText = commentElem.querySelector('.social__text');
    socialText.textContent = elem.comments[i].message;
    socialComments.appendChild(commentElem);
  }

  closeButton.addEventListener('click', () => {
    modalOpen.classList.remove('modal-open');
    bigPicture.classList.add('hidden');
  });

  window.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      modalOpen.classList.remove('modal-open');
      bigPicture.classList.add('hidden');
    }});
}

export {fullSizeDisplay};

