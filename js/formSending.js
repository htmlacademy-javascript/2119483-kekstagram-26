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
}

function keyDownHandler(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    if (document.activeElement === textHashtags || document.activeElement === textDescription) {
      evt.stopPropagation();
    } else {
      upLoadCancelHandler();
    }
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
  const regexp = /#[A-Za-zА-Яа-я]{1,19}/;
  const hashTags = value.toUpperCase().split(' ');
  function checkHashTag(elem) {
    return regexp.test(elem);
  }
  function checkRepeatHashTags(v,i,a) {
    return a.lastIndexOf(v)!==i;
  }
  const isMatchRegExp = hashTags.every(checkHashTag);
  const isGetRepeatHashTag = hashTags.some(checkRepeatHashTags);
  if (isMatchRegExp && !isGetRepeatHashTag && hashTags.length <= 5){
    return true;
  }
  return false;
}

pristine.addValidator(
  textHashtags,
  validateHashTags,
  'не пустая строка'
);

function validateDescription (value) {
  return value.length <= 140;
}

pristine.addValidator(
  textDescription,
  validateDescription,
  'До 140 символов'
);

function validFormHandler(evt) {
  if (!pristine.validate()){
    evt.preventDefault();
  }
}

/*console.log(document.activeElement);*/

imgUploadForm.addEventListener('submit', validFormHandler);
document.addEventListener('keydown', keyDownHandler);
upLoadFile.addEventListener('change', upLoadFileHandler);


