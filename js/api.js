
import {showAlert} from './utils.js';

function getData (onSuccess) {
  fetch('https://26.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error(`${response.status} — ${response.statusText}`);
    })
    .then((response) => response.json())
    .then((data) => onSuccess(data))
    .catch((error) => showAlert(error));
}

const sendData = (onSuccess, onFail, body, onFinal) => {
  fetch(
    'https://26.javascript.pages.academy/kekstagram',
    {
      method: 'POST',
      body,
    },
  ).then((response) => {
    if (response.ok) {
      return response;
    }
    throw new Error(`${response.status} — ${response.statusText}`);
  })
    .then((response) => response.json())
    .then((data) => onSuccess(data))
    .catch((error) => onFail(error))
    .finally(onFinal);
};

export {getData, sendData};
