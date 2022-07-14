const ALERT_SHOW_TIME = 5000;

function getRandomPositiveInteger (a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

function getRandomArrayElement(array) {
  return array[getRandomPositiveInteger (0, array.length - 1)];
}

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
  return regexp.test(elem) && elem.length >= 2;
}
function checkRepeatHashTags(v,i,a) {
  return a.lastIndexOf(v)!==i;
}

function validateDescription (value) {
  return value.length <= 140;
}

export {getRandomArrayElement, getRandomPositiveInteger, isEscapeKey, showAlert, checkHashTag, checkRepeatHashTags, validateDescription};
