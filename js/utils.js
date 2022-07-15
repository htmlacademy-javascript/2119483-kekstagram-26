
import {ALERT_SHOW_TIME,  MIN_HASHTAG_LENGTH,  MAX_COMMENT_LENGTH,  MAX_HASHTAGS_AMOUNT} from './constants.js';

function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

function showAlert(message) {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.textContent = message;
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

function validateDescription (value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

function getHashTags(value) {
  let hashTags = value.toUpperCase().split(' ');
  hashTags = hashTags.filter((elem) => elem.length > 0 && elem !== ' ');
  return hashTags;
}

function validateHashTags (value) {
  const regexp = /#[A-Za-zА-Яа-я]{1,19}/;
  const arrHashTags = getHashTags(value);
  const isMatchRegExp = arrHashTags.every((elem) => checkHashTag(elem, regexp));
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

function isClosePopup(evt, outter, inner, btn, func) {
  if (outter) {
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
  isClosePopup
};
