
import {showAlert} from './utils.js';
import {URL} from './constants.js';

function getData (onSuccess) {
  fetch(`${URL}/data`)
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
    URL,
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
