import {isEscapeKey, closePopupMessageForm} from './utils.js';
import {sendData} from './api.js';
import {ZOOM_STEP, FILE_TYPES, ZOOM_MAX, ZOOM_MIN} from './constants.js';
import {pristineTextHashTag, pristineTextDescription} from './validating.js';

const containerElement = document.querySelector('.img-upload');
const formElement = containerElement.querySelector('.img-upload__form');
const overlayElement = containerElement.querySelector('.img-upload__overlay');
const fileInputElement = containerElement.querySelector('#upload-file');
const cancelButtonElement = containerElement.querySelector('#upload-cancel');
const hashtagsInputElement = containerElement.querySelector('.text__hashtags');
const descriptionInputElement = containerElement.querySelector('.text__description');
const scaleContainerElement = document.querySelector('.img-upload__scale');
const scaleValueElement = overlayElement.querySelector('.scale__control--value');
const previewContainerElement = overlayElement.querySelector('.img-upload__preview img');
const sliderContainerElement = overlayElement.querySelector('.img-upload__effect-level');
const sliderElement = overlayElement.querySelector('.effect-level__slider');
const effectsListElement = overlayElement.querySelector('.effects__list');
const effectValueElement = overlayElement.querySelector('.effect-level__value');
const submitButtonElement = containerElement.querySelector('#upload-submit');
const effectNoneElement = containerElement.querySelector('#effect-none');
const errorTemplate = document.querySelector('#error');
const errorSectionElement = errorTemplate.content.querySelector('section');
const successTemplate = document.querySelector('#success');
const successSectionElement = successTemplate.content.querySelector('section');
const effectPreviewElements = containerElement.querySelectorAll('.effects__preview');
let effectSettings = getEffectSettings('--none');
let scaleImg = 1;

previewContainerElement.setAttribute('style', '');
previewContainerElement.style.cssText = '';

fileInputElement.addEventListener('change', uploadFileHandler);

function uploadNewFile() {
  const file = fileInputElement.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((elem) => fileName.endsWith(elem));
  const objURL = URL.createObjectURL(file);
  if (matches) {
    previewContainerElement.src = objURL;
    for (let i = 0; i < effectPreviewElements.length; i++){
      effectPreviewElements[i].classList.remove('effects__preview');
      effectPreviewElements[i].classList.add('effects__upload');
      effectPreviewElements[i].style.backgroundImage = `url(${objURL})`;
    }
  }
}

function getOldItemsStatus() {
  effectPreviewElements.forEach((item) => {
    item.classList.add('effects__preview');
    item.classList.remove('effects__upload');
  });
}

function uploadFileHandler() {
  uploadNewFile();
  overlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  previewContainerElement.classList.remove(...previewContainerElement.classList);
  previewContainerElement.classList.add('effects_preview--none');
  sliderContainerElement.classList.add('hidden');
  previewContainerElement.style.cssText = 'transform: scale(1.0)';
  scaleValueElement.value = '100%';
  scaleValueElement.setAttribute('value', '100%');
  scaleContainerElement.addEventListener('click', scaleChangeHandler);
  effectsListElement.addEventListener('click', effectsListHandler);
  document.addEventListener('keydown', keydownHandler);
  cancelButtonElement.addEventListener('click', uploadCancelHandler);
  document.addEventListener('click', closeModalOuterHandler);
  formElement.addEventListener('submit', submitFormHandler);
}

function uploadCancelHandler() {
  getOldItemsStatus();
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  fileInputElement.value = '';
  hashtagsInputElement.value = '';
  descriptionInputElement.value = '';
  previewContainerElement.classList.remove(...previewContainerElement.classList);
  previewContainerElement.classList.add('effects_preview--none');
  previewContainerElement.style.cssText = 'transform: scale(1.0)';
  scaleValueElement.value = '100%';
  scaleImg = 1;
  effectSettings = getEffectSettings('--none');
  effectNoneElement.checked = true;
  sliderContainerElement.classList.add('hidden');
  scaleContainerElement.removeEventListener('click', scaleChangeHandler);
  effectsListElement.removeEventListener('click', effectsListHandler);
  document.removeEventListener('keydown', keydownHandler);
  document.removeEventListener('click', closeModalOuterHandler);
  cancelButtonElement.removeEventListener('click', uploadCancelHandler);
  formElement.removeEventListener('submit', submitFormHandler);
}

function keydownHandler(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    if (document.activeElement === hashtagsInputElement || document.activeElement === descriptionInputElement) {
      return false;
    }
    else if (successSectionElement.parentElement) {
      closeSuccessFormHandler();
    }
    else if (errorSectionElement.parentElement) {
      closeErrorFormHandler();
    }
    else {
      uploadCancelHandler();
    }
  }
}

function scaleChangeHandler(evt) {
  let res = parseInt(scaleValueElement.value, 10);
  if (evt.target.className.includes('smaller')){
    if (res <= ZOOM_STEP ){
      res = ZOOM_MIN;
    }
    else {
      res -= ZOOM_STEP;
    }
  } else if (evt.target.className.includes('bigger')){
    if ((res + ZOOM_STEP) >= ZOOM_MAX ){
      res = ZOOM_MAX;
    }
    else {
      res += ZOOM_STEP;
    }
  }
  scaleValueElement.value = `${res}%`;
  scaleValueElement.setAttribute('value', `${res}%`);
  scaleImg = res/100;
  updateImgStyle();
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
    to: function(value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: function(value) {
      return parseFloat(value);
    },
  }
});

function getEffectSettings(effectVal) {
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
    sliderContainerElement.classList.add('hidden');
    previewContainerElement.style.cssText = `transform: scale(${scaleImg});`;
  } else {
    sliderContainerElement.classList.remove('hidden');
    previewContainerElement.classList.add(effectName);
    previewContainerElement.style.cssText = `filter: ${filterType}(${filterIntensity}${filterMeasure}); transform: scale(${scaleImg});`;
  }
}

function effectsListHandler(evt) {
  const selectedEffectClassName = evt.target.parentElement.querySelector('span').className;
  const effectClassName = selectedEffectClassName.replace('effects__upload', '').replace('effects__preview', '').trim();
  previewContainerElement.classList.remove(...previewContainerElement.classList);
  previewContainerElement.style.cssText = '';
  effectSettings = getEffectSettings(effectClassName);
  sliderElement.noUiSlider.updateOptions(effectSettings.sliderOptions);
  updateImgStyle();
}

sliderElement.noUiSlider.on('update', () => {
  const sliderVal = sliderElement.noUiSlider.get();
  if (effectSettings){
    effectSettings.filterIntensity = sliderVal;
    updateImgStyle();
    effectValueElement.setAttribute('value', effectSettings.filterIntensity);
  }
});

function unblockSubmitButton()  {
  submitButtonElement.disabled = false;
}

function onFail() {
  errorSectionElement.setAttribute('style', 'z-index: 2');
  document.body.appendChild(errorSectionElement);
}
function closeErrorFormHandler() {
  document.body.removeChild(errorSectionElement);
}

function onSuccess() {
  successSectionElement.setAttribute('style', 'z-index: 2');
  document.body.appendChild(successSectionElement);
}

function closeSuccessFormHandler() {
  document.body.removeChild(successSectionElement);
  uploadCancelHandler();
}

function closeModalOuterHandler(evt) {
  const successOutter = document.querySelector('.success');
  const successButton = document.querySelector('.success__button');
  const successInner = document.querySelector('.success div');
  const errorOutter = document.querySelector('.error');
  const errorButton = document.querySelector('.error__button');
  const errorInner = document.querySelector('.error div');

  closePopupMessageForm(evt, successOutter, successInner, successButton, closeSuccessFormHandler);
  closePopupMessageForm(evt, errorOutter, errorInner, errorButton, closeErrorFormHandler);
}

function submitFormHandler(evt) {
  evt.preventDefault();
  const isValidHashTag = pristineTextHashTag.validate();
  const isValidTextDescription = pristineTextDescription.validate();
  if (isValidHashTag && isValidTextDescription) {
    submitButtonElement.disabled = true;
    sendData(
      onSuccess,
      onFail,
      new FormData(evt.target),
      unblockSubmitButton
    );
  }
}
