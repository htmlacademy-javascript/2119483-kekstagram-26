import {validateHashTags, getRepeatHashTags, getHashTagAmount, getHashTagLength, validateDescription} from './utils.js';
import {MAX_COMMENT_LENGTH, MAX_HASHTAGS_AMOUNT, MIN_HASHTAG_LENGTH} from './constants.js';

const imgUpload = document.querySelector('.img-upload');
const imgUploadForm = imgUpload.querySelector('.img-upload__form');
const textHashtags = imgUpload.querySelector('.text__hashtags');
const textDescription = imgUpload.querySelector('.text__description');

const pristine = new Pristine(imgUploadForm, {
  classTo: 'form-group',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'form-group',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
});

pristine.addValidator(
  textHashtags,
  validateHashTags,
  'Некорректный формат хештега'
);

pristine.addValidator(
  textHashtags,
  getRepeatHashTags,
  'Не должно быть повторяющихся хештегов'
);

pristine.addValidator(
  textHashtags,
  getHashTagAmount,
  `Количество хештегов не может быть больше ${MAX_HASHTAGS_AMOUNT}`
);

pristine.addValidator(
  textHashtags,
  getHashTagLength,
  `Минимальная длина хештега ${MIN_HASHTAG_LENGTH} символа`
);

pristine.addValidator(
  textDescription,
  validateDescription,
  `Длина строки до ${MAX_COMMENT_LENGTH} символов`
);

export {pristine};
