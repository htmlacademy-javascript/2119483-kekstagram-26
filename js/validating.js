import {validateHashTags, getRepeatHashTags, getHashTagAmount, getHashTagLength, validateDescription} from './utils.js';
import {MAX_COMMENT_LENGTH, MAX_HASHTAGS_AMOUNT, MIN_HASHTAG_LENGTH} from './constants.js';

const imgUpload = document.querySelector('.img-upload');
const imgUploadForm = imgUpload.querySelector('.img-upload__form');
const textHashtags = imgUpload.querySelector('.text__hashtags');
const textDescription = imgUpload.querySelector('.text__description');

const pristineTextHashTag = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
});

const pristineTextDescription = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
});

pristineTextHashTag.addValidator(
  textHashtags,
  validateHashTags,
  'Некорректный формат хештега'
);

pristineTextHashTag.addValidator(
  textHashtags,
  getRepeatHashTags,
  'Не должно быть повторяющихся хештегов'
);

pristineTextHashTag.addValidator(
  textHashtags,
  getHashTagAmount,
  `Количество хештегов не может быть больше ${MAX_HASHTAGS_AMOUNT}`
);

pristineTextHashTag.addValidator(
  textHashtags,
  getHashTagLength,
  `Минимальная длина хештега ${MIN_HASHTAG_LENGTH} символа`
);

pristineTextDescription.addValidator(
  textDescription,
  validateDescription,
  `Длина строки до ${MAX_COMMENT_LENGTH} символов`
);

export {pristineTextHashTag, pristineTextDescription};
