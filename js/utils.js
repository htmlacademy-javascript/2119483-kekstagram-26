
import {ALERT_SHOW_TIME,  MIN_HASHTAG_LENGTH,  MAX_COMMENT_LENGTH,  MAX_HASHTAG_LENGTH, MAX_HASHTAGS_AMOUNT, REGEXP} from './constants.js';

export function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

export function showAlert(message) {
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

export function getHashTagMinLength(value) {
  const arrHashTags = getHashTags(value);
  const isMinLength = arrHashTags.every((elem) => elem.length >= MIN_HASHTAG_LENGTH);
  return isMinLength;
}

export function getHashTagMaxLength(value) {
  const arrHashTags = getHashTags(value);
  const isMaxLength = arrHashTags.every((elem) => elem.length <= MAX_HASHTAG_LENGTH);
  return isMaxLength;
}

function checkRepeatHashTags(v,i,a) {
  return a.lastIndexOf(v)!==i;
}

export function validateDescription(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

function getHashTags(value) {
  let hashTags = value.toUpperCase().split(' ');
  hashTags = hashTags.filter((elem) => elem.length > 0 && elem !== ' ');
  return hashTags;
}

export function validateHashTags(value) {
  const arrHashTags = getHashTags(value);
  const isMatchRegExp = arrHashTags.every((elem) => checkHashTag(elem, REGEXP));
  return isMatchRegExp;
}

export function getRepeatHashTags(value) {
  const arrHashTags = getHashTags(value);
  const isGetRepeatHashTag = arrHashTags.some(checkRepeatHashTags);
  return !isGetRepeatHashTag;
}

export function getHashTagAmount(value){
  const arrHashTags = getHashTags(value);
  return arrHashTags.length <= MAX_HASHTAGS_AMOUNT;
}

export function closePopupMessageForm(evt, outer, inner, btn, func) {
  if (outer) {
    const isClickInside = inner.contains(evt.target);
    const isClickButton = btn.contains(evt.target);
    /*if (isClickButton) {
      func();
    }
    else if (!isClickInside && !isClickButton){
      func();
    }*/
    if (isClickButton || !isClickInside){
      func();
    }
  }
}

export function debounce(callback, timeoutDelay) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

export function getRandomPositiveInteger(a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}
