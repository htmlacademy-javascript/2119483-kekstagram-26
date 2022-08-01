import {validateHashTags, getRepeatHashTags, getHashTagAmount, getHashTagMinLength, getHashTagMaxLength, validateDescription} from './utils.js';
import {MAX_COMMENT_LENGTH, MAX_HASHTAGS_AMOUNT, MAX_HASHTAG_LENGTH, MIN_HASHTAG_LENGTH} from './constants.js';

const containerElement = document.querySelector('.img-upload');
const formElement = containerElement.querySelector('.img-upload__form');
const hashtagsInputElement = containerElement.querySelector('.text__hashtags');
const descriptionInputElement = containerElement.querySelector('.text__description');

const pristine = new Pristine(formElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
});

pristine.addValidator(
  hashtagsInputElement,
  validateHashTags,
  'Некорректный формат хештега'
);

pristine.addValidator(
  hashtagsInputElement,
  getRepeatHashTags,
  'Не должно быть повторяющихся хештегов'
);

pristine.addValidator(
  hashtagsInputElement,
  getHashTagAmount,
  `Количество хештегов не может быть больше ${MAX_HASHTAGS_AMOUNT}`
);

pristine.addValidator(
  hashtagsInputElement,
  getHashTagMinLength,
  `Минимальная длина хештега ${MIN_HASHTAG_LENGTH} символа`
);

pristine.addValidator(
  hashtagsInputElement,
  getHashTagMaxLength,
  `Максимальная длина хештега ${MAX_HASHTAG_LENGTH} символов включая #`
);

pristine.addValidator(
  descriptionInputElement,
  validateDescription,
  `Длина строки до ${MAX_COMMENT_LENGTH} символов`
);

export {pristine};

