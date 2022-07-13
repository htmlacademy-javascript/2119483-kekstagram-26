import {isEscapeKey} from './utils.js';
import {sendData} from './api.js';

const imgUpload = document.querySelector('.img-upload');
const imgUploadForm = imgUpload.querySelector('.img-upload__form');
const imgFilterForm = imgUpload.querySelector('.img-upload__overlay');
const upLoadFile = imgUpload.querySelector('#upload-file');
const upLoadCancel = imgUpload.querySelector('#upload-cancel');
const textHashtags = imgUpload.querySelector('.text__hashtags');
const textDescription = imgUpload.querySelector('.text__description');
const imgUploadScale = document.querySelector('.img-upload__scale');
const scaleControlValue = imgFilterForm.querySelector('.scale__control--value');
const imgUploadPreview = imgFilterForm.querySelector('.img-upload__preview img');
imgUploadPreview.setAttribute('style', '');
imgUploadPreview.style.cssText = '';
const sliderContainer = imgFilterForm.querySelector('.img-upload__effect-level');
const sliderElement = imgFilterForm.querySelector('.effect-level__slider');
const effectsList = imgFilterForm.querySelector('.effects__list');
const effectLevelValue = imgFilterForm.querySelector('.effect-level__value');
const submitButton = imgUpload.querySelector('.img-upload__submit');
const effectNone = imgUpload.querySelector('#effect-none');
let effectSettings = undefined;
let scaleImg = 1;

const errorTemplate = document.querySelector('#error');
const errorSection = errorTemplate.content.querySelector('section');
const errorButton = errorTemplate.content.querySelector('.error__button');
const successTemplate = document.querySelector('#success');
const successSection = successTemplate.content.querySelector('section');
const successButton = successTemplate.content.querySelector('.success__button');

function upLoadFileHandler () {
  imgFilterForm.classList.remove('hidden');
  document.body.classList.add('modal-open');
  imgUploadPreview.classList.add('effects_preview--none');
  sliderContainer.classList.add('hidden');
  imgUploadPreview.classList.remove(...imgUploadPreview.classList);
  imgUploadPreview.style.cssText = 'transform: scale(1.0)';
  scaleControlValue.value = '100%';
  scaleControlValue.setAttribute('value', '100%');
  imgUploadScale.addEventListener('click', scaleChangeHandler);
  effectsList.addEventListener('click', effectsListHandler);
  document.addEventListener('keydown', keyDownHandler);
  upLoadCancel.addEventListener('click', upLoadCancelHandler);
}

function upLoadCancelHandler() {
  imgFilterForm.classList.add('hidden');
  document.body.classList.remove('modal-open');
  upLoadFile.value = '';
  textHashtags.value = '';
  textDescription.value = '';
  imgUploadPreview.classList.remove(...imgUploadPreview.classList);
  imgUploadPreview.style.cssText = 'transform: scale(1.0)';
  scaleControlValue.value = '100%';
  scaleImg = 1;
  effectSettings = {};
  effectNone.checked = true;
  imgUploadScale.removeEventListener('click', scaleChangeHandler);
  effectsList.removeEventListener('click', effectsListHandler);
  document.removeEventListener('keydown', keyDownHandler);
}

function keyDownHandler(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    if (document.activeElement === textHashtags || document.activeElement === textDescription) {
      return false;
    }
    else if (successSection.parentElement) {
      closeSuccessFormHandler();
    }
    else if (errorSection.parentElement) {
      closeErrorFormHandler();
    }
    else {
      upLoadCancelHandler();
    }
  }
}

const pristine = new Pristine(imgUploadForm, {
  classTo: 'form-group',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'form-group',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
});

function validateHashTags (value) {
  const regexp = /#[A-Za-zА-Яа-я]{1,19}/;
  let hashTags = value.toUpperCase().split(' ');
  hashTags = hashTags.filter((elem) => elem.length > 0);
  function checkHashTag(elem) {
    return regexp.test(elem) && elem.length >= 2;
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
  'Некорректный формат хештега'
);

function validateDescription (value) {
  return value.length <= 140;
}

pristine.addValidator(
  textDescription,
  validateDescription,
  'Длина строки до 140 символов'
);

function scaleChangeHandler(evt) {
  let res = parseInt(scaleControlValue.value, 10);
  if (evt.target.className.includes('smaller')){
    if (res <= 25 ){
      res = 0;
    }
    else {
      res -= 25;
    }
  } else if (evt.target.className.includes('bigger')){
    if ((res + 25) >= 100 ){
      res = 100;
    }
    else {
      res += 25;
    }
  }
  scaleControlValue.value = `${res}%`;
  scaleControlValue.setAttribute('value', `${res}%`);
  scaleImg = res/100;
  if (effectSettings){
    updateImgStyle();
  } else {
    effectSettings = getEffectSettings('--none');
    updateImgStyle();
  }
}

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: function (value) {
      return parseFloat(value);
    },
  }
});

function getEffectSettings (effectVal) {
  const returnedObj = {
    effectName: `effects__preview${effectVal}`,
    sliderOptions: {},
    filterType: '',
    filterMeasure: '',
    filterIntensity: 1
  };
  switch (effectVal){
    case '--chrome':
      returnedObj.sliderOptions = {
        range: {
          min: 0,
          max: 1
        },
        start: 1,
        step: 0.1
      };
      returnedObj.filterType = 'grayscale';
      returnedObj.filterMeasure = '';
      returnedObj.filterIntensity = 1;
      return returnedObj;
    case '--sepia':
      returnedObj.sliderOptions = {
        range: {
          min: 0,
          max: 1
        },
        start: 1,
        step: 0.1
      };
      returnedObj.filterType = 'sepia';
      returnedObj.filterMeasure = '';
      returnedObj.filterIntensity = 1;
      return returnedObj;
    case '--marvin':
      returnedObj.sliderOptions = {
        range: {
          min: 0,
          max: 100
        },
        start: 100,
        step: 1
      };
      returnedObj.filterType = 'invert';
      returnedObj.filterMeasure = '%';
      returnedObj.filterIntensity = 100;
      return returnedObj;
    case '--phobos':
      returnedObj.sliderOptions = {
        range: {
          min: 0,
          max: 3
        },
        start: 3,
        step: 0.1
      };
      returnedObj.filterType = 'blur';
      returnedObj.filterMeasure = 'px';
      returnedObj.filterIntensity = 3;
      return returnedObj;
    case '--heat':
      returnedObj.sliderOptions = {
        range: {
          min: 1,
          max: 3
        },
        start: 3,
        step: 0.1
      };
      returnedObj.filterType = 'brightness';
      returnedObj.filterMeasure = '';
      returnedObj.filterIntensity = 3;
      return returnedObj;
    default:
      return returnedObj;
  }
}

function updateImgStyle() {
  const {effectName, filterIntensity,  filterType, filterMeasure} = effectSettings;
  if (effectName === 'effects__preview--none'){
    sliderContainer.classList.add('hidden');
    imgUploadPreview.style.cssText = `transform: scale(${scaleImg});`;
  } else {
    sliderContainer.classList.remove('hidden');
    imgUploadPreview.classList.add(effectName);
    imgUploadPreview.style.cssText = `filter: ${filterType}(${filterIntensity}${filterMeasure}); transform: scale(${scaleImg});`;
  }
}

function effectsListHandler(evt) {
  const selectedEffectClassName = evt.target.parentElement.querySelector('span').className;
  const effectClassName = selectedEffectClassName.replaceAll('effects__preview', '').trim();
  imgUploadPreview.classList.remove(...imgUploadPreview.classList);
  imgUploadPreview.style.cssText = '';
  effectSettings = getEffectSettings(effectClassName);
  sliderElement.noUiSlider.updateOptions(effectSettings.sliderOptions);
  updateImgStyle();
}

sliderElement.noUiSlider.on('update', () => {
  const sliderVal = sliderElement.noUiSlider.get();
  if (effectSettings){
    effectSettings.filterIntensity = sliderVal;
    updateImgStyle();
    effectLevelValue.setAttribute('value', effectSettings.filterIntensity);
  }
});

function blockSubmitButton () {
  submitButton.disabled = true;
  submitButton.textContent = 'Сохраняю...';
}

function unblockSubmitButton ()  {
  submitButton.disabled = false;
  submitButton.textContent = 'Сохранить';
}

function onFail() {
  errorSection.setAttribute('style', 'z-index: 2');
  document.body.appendChild(errorSection);
}

function closeErrorFormHandler() {
  document.body.removeChild(errorSection);
}

function maybeCloseFormHandler(evt) {
  if (evt.target === errorSection) {
    closeErrorFormHandler();
  } else if (evt.target === successSection) {
    closeSuccessFormHandler();
  }
}

function onSuccess() {
  successSection.setAttribute('style', 'z-index: 2');
  document.body.appendChild(successSection);
}

function closeSuccessFormHandler() {
  document.body.removeChild(successSection);
  upLoadCancelHandler();
}

errorButton.addEventListener('click', closeErrorFormHandler);
errorSection.addEventListener('click', maybeCloseFormHandler);

successButton.addEventListener('click', closeSuccessFormHandler);
successSection.addEventListener('click', maybeCloseFormHandler);

function submitFormHandler(evt) {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    blockSubmitButton();
    sendData(
      () => {
        onSuccess();
        unblockSubmitButton();
      },
      () => {
        onFail();
        unblockSubmitButton();
      },
      new FormData(evt.target),
    );
  }
}

upLoadFile.addEventListener('change', upLoadFileHandler);
imgUploadForm.addEventListener('submit', submitFormHandler);

