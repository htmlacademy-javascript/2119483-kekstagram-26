import {isEscapeKey} from './utils.js';

const imgUpload  = document.querySelector('.img-upload');
const imgUploadForm = imgUpload.querySelector('.img-upload__form');
const imgFilterForm = imgUpload.querySelector('.img-upload__overlay');
const upLoadFile = imgUpload.querySelector('#upload-file');
const upLoadCancel = imgUpload.querySelector('#upload-cancel');
const textHashtags = imgUpload.querySelector('.text__hashtags');
const textDescription = imgUpload.querySelector('.text__description');
const scaleControlSmaller = imgFilterForm.querySelector('.scale__control--smaller');
const scaleControlBigger = imgFilterForm.querySelector('.scale__control--bigger');
const scaleControlValue = imgFilterForm.querySelector('.scale__control--value');
const imgUploadPreview = imgFilterForm.querySelector('.img-upload__preview').querySelector('img');
imgUploadPreview.setAttribute('style', '');
imgUploadPreview.style.cssText = '';
const sliderContainer = imgFilterForm.querySelector('.img-upload__effect-level');
const sliderElement = imgFilterForm.querySelector('.effect-level__slider');
const effectsList = imgFilterForm.querySelector('.effects__list');
let effectSettings = undefined;
let scaleImg = 1;

function upLoadFileHandler () {
  imgFilterForm.classList.remove('hidden');
  document.body.classList.add('modal-open');
  imgUploadPreview.classList.add('effects_preview--none');
  sliderContainer.classList.add('hidden');
  imgUploadPreview.style.cssText = 'transform: scale(1.0)';
  scaleControlValue.value = '100%';
  scaleControlSmaller.addEventListener('click', scaleChangeHandler);
  scaleControlBigger.addEventListener('click', scaleChangeHandler);
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
  scaleControlSmaller.removeEventListener('click', scaleChangeHandler);
  scaleControlBigger.removeEventListener('click', scaleChangeHandler);
  effectsList.removeEventListener('click', effectsListHandler);
  document.removeEventListener('keydown', keyDownHandler);
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
  classTo: 'form-group',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'form-group',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
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

function validFormHandler() {
  pristine.validate();
}

function scaleChangeHandler(evt) {
  let res = parseInt(scaleControlValue.value, 10);
  if (evt.target.className.includes('smaller')){
    if (res <= 25 ){
      scaleControlValue.value = 0;
      res = 0;
    }
    else {
      res -= 25;
      scaleControlValue.value = res;
    }
  } else {
    if ((res + 25) >= 100 ){
      scaleControlValue.value = 100;
      res = 100;
    }
    else {
      res += 25;
      scaleControlValue.value = res;
    }
  }
  scaleControlValue.value += '%';
  scaleImg = (res/100).toFixed(2);
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
  const returnedObj = {};
  returnedObj.effectName = `effects__preview${effectVal}`;
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
      returnedObj.sliderOptions = {};
      returnedObj.filterType = '';
      returnedObj.filterMeasure = '';
      returnedObj.filterIntensity = 0;
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
  effectSettings = getEffectSettings(effectClassName);
  sliderElement.noUiSlider.updateOptions(effectSettings.sliderOptions);
  updateImgStyle();
}

sliderElement.noUiSlider.on('update', () => {
  const sliderVal = sliderElement.noUiSlider.get();
  if (effectSettings){
    effectSettings.filterIntensity = sliderVal;
    updateImgStyle();
  }
});

upLoadFile.addEventListener('change', upLoadFileHandler);
imgUploadForm.addEventListener('submit', validFormHandler);

