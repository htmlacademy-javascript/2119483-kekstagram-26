import {isEscapeKey, closePopupMessageForm} from './utils.js';
import {sendData} from './api.js';
import {ZOOM_STEP, FILE_TYPES, ZOOM_MAX, ZOOM_MIN} from './constants.js';
import {pristineTextHashTag, pristineTextDescription} from './validating.js';

const imgUpload = document.querySelector('.img-upload');
const imgUploadForm = imgUpload.querySelector('.img-upload__form');
const imgFilterForm = imgUpload.querySelector('.img-upload__overlay');
const uploadFile = imgUpload.querySelector('#upload-file');
const uploadCancel = imgUpload.querySelector('#upload-cancel');
const textHashtags = imgUpload.querySelector('.text__hashtags');
const textDescription = imgUpload.querySelector('.text__description');
const imgUploadScale = document.querySelector('.img-upload__scale');
const scaleControlValue = imgFilterForm.querySelector('.scale__control--value');
const imgUploadPreview = imgFilterForm.querySelector('.img-upload__preview img');
const sliderContainer = imgFilterForm.querySelector('.img-upload__effect-level');
const sliderElem = imgFilterForm.querySelector('.effect-level__slider');
const effectsList = imgFilterForm.querySelector('.effects__list');
const effectLevelValue = imgFilterForm.querySelector('.effect-level__value');
const submitButton = imgUpload.querySelector('#upload-submit');
const effectNone = imgUpload.querySelector('#effect-none');
const errorTemplate = document.querySelector('#error');
const errorSection = errorTemplate.content.querySelector('section');
const successTemplate = document.querySelector('#success');
const successSection = successTemplate.content.querySelector('section');
const items = imgUpload.querySelectorAll('.effects__preview');
let effectSettings = getEffectSettings('--none');
let scaleImg = 1;

imgUploadPreview.setAttribute('style', '');
imgUploadPreview.style.cssText = '';

uploadFile.addEventListener('change', uploadFileHandler);

function uploadNewFile() {
  const file = uploadFile.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((elem) => fileName.endsWith(elem));
  if (matches) {
    imgUploadPreview.src = URL.createObjectURL(file);
    for (let i = 0; i < items.length; i++){
      items[i].classList.remove('effects__preview');
      items[i].classList.add('effects__upload');
      items[i].setAttribute('style', `background-image: url(${URL.createObjectURL(file)});`);
    }
  }
}

function getOldItemsStatus() {
  items.forEach((item) => {
    item.classList.add('effects__preview');
    item.classList.remove('effects__upload');
  });
}

function uploadFileHandler() {
  uploadNewFile();
  imgFilterForm.classList.remove('hidden');
  document.body.classList.add('modal-open');
  imgUploadPreview.classList.remove(...imgUploadPreview.classList);
  imgUploadPreview.classList.add('effects_preview--none');
  sliderContainer.classList.add('hidden');
  imgUploadPreview.style.cssText = 'transform: scale(1.0)';
  scaleControlValue.value = '100%';
  scaleControlValue.setAttribute('value', '100%');
  imgUploadScale.addEventListener('click', scaleChangeHandler);
  effectsList.addEventListener('click', effectsListHandler);
  document.addEventListener('keydown', keydownHandler);
  uploadCancel.addEventListener('click', uploadCancelHandler);
  document.addEventListener('click', closeModalOuterHandler);
  imgUploadForm.addEventListener('submit', submitFormHandler);
}

function uploadCancelHandler() {
  getOldItemsStatus();
  imgFilterForm.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadFile.value = '';
  textHashtags.value = '';
  textDescription.value = '';
  imgUploadPreview.classList.remove(...imgUploadPreview.classList);
  imgUploadPreview.classList.add('effects_preview--none');
  imgUploadPreview.style.cssText = 'transform: scale(1.0)';
  scaleControlValue.value = '100%';
  scaleImg = 1;
  effectSettings = getEffectSettings('--none');
  effectNone.checked = true;
  sliderContainer.classList.add('hidden');
  imgUploadScale.removeEventListener('click', scaleChangeHandler);
  effectsList.removeEventListener('click', effectsListHandler);
  document.removeEventListener('keydown', keydownHandler);
  document.removeEventListener('click', closeModalOuterHandler);
  uploadCancel.removeEventListener('click', uploadCancelHandler);
  imgUploadForm.removeEventListener('submit', submitFormHandler);
}

function keydownHandler(evt) {
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
      uploadCancelHandler();
    }
  }
}

function scaleChangeHandler(evt) {
  let res = parseInt(scaleControlValue.value, 10);
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
  scaleControlValue.value = `${res}%`;
  scaleControlValue.setAttribute('value', `${res}%`);
  scaleImg = res/100;
  updateImgStyle();
}

noUiSlider.create(sliderElem, {
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
  const effectClassName = selectedEffectClassName.replace('effects__upload', '').replace('effects__preview', '').trim();
  imgUploadPreview.classList.remove(...imgUploadPreview.classList);
  imgUploadPreview.style.cssText = '';
  effectSettings = getEffectSettings(effectClassName);
  sliderElem.noUiSlider.updateOptions(effectSettings.sliderOptions);
  updateImgStyle();
}

sliderElem.noUiSlider.on('update', () => {
  const sliderVal = sliderElem.noUiSlider.get();
  if (effectSettings){
    effectSettings.filterIntensity = sliderVal;
    updateImgStyle();
    effectLevelValue.setAttribute('value', effectSettings.filterIntensity);
  }
});

function unblockSubmitButton()  {
  submitButton.disabled = false;
}

function onFail() {
  errorSection.setAttribute('style', 'z-index: 2');
  document.body.appendChild(errorSection);
}
function closeErrorFormHandler() {
  document.body.removeChild(errorSection);
}

function onSuccess() {
  successSection.setAttribute('style', 'z-index: 2');
  document.body.appendChild(successSection);
}

function closeSuccessFormHandler() {
  document.body.removeChild(successSection);
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
    submitButton.disabled = true;
    sendData(
      onSuccess,
      onFail,
      new FormData(evt.target),
      unblockSubmitButton
    );
  }
}
