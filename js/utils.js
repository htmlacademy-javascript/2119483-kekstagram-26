
import {ALERT_SHOW_TIME,  MIN_HASHTAG_LENGTH,  MAX_COMMENT_LENGTH,  MAX_HASHTAGS_AMOUNT, REGEXP} from './constants.js';

function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

function showAlert(message) {
  const alertContainer = document.createElement('div');
  alertContainer.textContent = message;
  alertContainer.classList.add('alert-message--active');
  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
}

function checkHashTag(elem, regexp) {
  return regexp.test(elem) && elem.indexOf('#', 1) === -1;
}

function getHashTagLength(value) {
  const arrHashTags = getHashTags(value);
  const isMinLength = arrHashTags.every((elem) => elem.length >= MIN_HASHTAG_LENGTH);
  return isMinLength;
}

function checkRepeatHashTags(v,i,a) {
  return a.lastIndexOf(v)!==i;
}

function validateDescription(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

function getHashTags(value) {
  let hashTags = value.toUpperCase().split(' ');
  hashTags = hashTags.filter((elem) => elem.length > 0 && elem !== ' ');
  return hashTags;
}

function validateHashTags(value) {
  const arrHashTags = getHashTags(value);
  const isMatchRegExp = arrHashTags.every((elem) => checkHashTag(elem, REGEXP));
  return isMatchRegExp;
}

function getRepeatHashTags(value) {
  const arrHashTags = getHashTags(value);
  const isGetRepeatHashTag = arrHashTags.some(checkRepeatHashTags);
  return !isGetRepeatHashTag;
}

function getHashTagAmount(value){
  const arrHashTags = getHashTags(value);
  return arrHashTags.length <= MAX_HASHTAGS_AMOUNT;
}

function closePopupMessageForm(evt, outer, inner, btn, func) {
  if (outer) {
    const isClickInside = inner.contains(evt.target);
    const isClickButton = btn.contains(evt.target);
    if (isClickButton) {
      func();
    }
    else if (!isClickInside && !isClickButton){
      func();
    }
  }
}

export {
  isEscapeKey,
  showAlert,
  checkHashTag,
  checkRepeatHashTags,
  validateHashTags,
  getRepeatHashTags,
  getHashTagAmount,
  getHashTagLength,
  validateDescription,
  closePopupMessageForm
};
