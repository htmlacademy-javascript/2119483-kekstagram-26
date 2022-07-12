
import {showAlert} from './utils.js';

function getData (onSuccess) {
  fetch('https://26.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        response.json()
          .then((data) => onSuccess(data))
          .catch(() => {
            showAlert ('Некорректный формат данных');
          });
      } else {
        showAlert (`Сервер вернул ошибку: ${response.status} - ${response.statusText}`);
      }
    })
    .catch(()=> {
      showAlert ('Не удалось загрузить данные c сервера');
    });
}

const sendData = (onSuccess, onFail, body) => {
  fetch(
    'https://26.javascript.pages.academy/kekstagram',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail('Не удалось отправить форму. Попробуйте ещё раз');
      }
    })
    .catch(() => {
      onFail('Не удалось отправить форму. Попробуйте ещё раз');
    });
};

export {getData, sendData};
