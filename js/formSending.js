import {isEscapeKey} from './utils.js';

const imgUpload  = document.querySelector('.img-upload');
const imgUploadForm = imgUpload.querySelector('.img-upload__form');
const imgFilterForm = imgUpload.querySelector('.img-upload__overlay');
const upLoadFile = imgUpload.querySelector('#upload-file');
const upLoadCancel = imgUpload.querySelector('#upload-cancel');
const textHashtags = imgUpload.querySelector('.text__hashtags');
const textDescription = imgUpload.querySelector('.text__description');

function upLoadFileHandler () {
  imgFilterForm.classList.remove('hidden');
  document.body.classList.add('modal-open');
  upLoadCancel.addEventListener('click', upLoadCancelHandler);
}

function upLoadCancelHandler() {
  imgFilterForm.classList.add('hidden');
  document.body.classList.remove('modal-open');
  upLoadFile.value = '';
  textHashtags.value = '';
  textDescription.value = '';
  imgUploadForm.removeEventListener('submit', validFormHandler);
  document.removeEventListener('keydown', keyDownHandler);
  upLoadFile.removeEventListener('change', upLoadFileHandler);
}

function keyDownHandler(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    upLoadCancelHandler();
  }
}

const pristine = new Pristine(imgUploadForm, {
  classTo: 'img-upload__form',
  errorClass: 'img-upload__form--invalid',
  successClass: 'img-upload__form--valid',
  errorTextParent: 'img-upload__form',
  errorTextTag: 'span',
  errorTextClass: 'form_error'
});

function validateHashTags (value) {
  return value !== '';
}

pristine.addValidator(
  textHashtags,
  validateHashTags,
  'не пустая строка'
);

function validateDiscription (value) {
  return value.length <= 140;
}

pristine.addValidator(
  textDescription,
  validateDiscription,
  'До 140 символов'
);

function validFormHandler(evt) {
  if (!pristine.validate()){
    evt.preventDefault();
  }
}

imgUploadForm.addEventListener('submit', validFormHandler);
document.addEventListener('keydown', keyDownHandler);
upLoadFile.addEventListener('change', upLoadFileHandler);
