const ALERT_SHOW_TIME = 5000;
const URL = 'https://26.javascript.pages.academy/kekstagram';
const COMMENTS_STEP = 5;

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

export {
  isEscapeKey,
  showAlert,
  checkHashTag,
  checkRepeatHashTags,
  validateDescription,
  URL,
  COMMENTS_STEP
};
