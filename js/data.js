import {getRandomArrayElement, getRandomPositiveInteger} from './utils.js';

const SIMILAR_OBJECT_COUNT = 25;
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const NAMES = [
  'Алексей',
  'Ясмина',
  'Максим',
  'Фёдор',
  'Эвелина',
  'Вероника',
  'Сергей',
  'Мирон',
  'Владислав',
  'Агата'
];
const DESCRIPTIONS = [
  'Описание_1',
  'Описание_2',
  'Описание_3',
  'Описание_4',
  'Описание_5',
  'Описание_6',
  'Описание_7',
  'Описание_8',
  'Описание_9',
  'Описание_10'
];

const arrIdComments = [];
const arrIdObjects = [];
const arrIdUrls = [];

function getUniqueRandomPositiveInt (a, b, arr) {
  let result = getRandomPositiveInteger (a, b);
  while (arr.includes(result)) {
    result = getRandomPositiveInteger (a, b);
  }
  arr.push(result);
  return result;
}

function createComment() {
  return {
    id: getUniqueRandomPositiveInt (0, 200, arrIdComments),
    avatar: `img/avatar-${getRandomPositiveInteger (1, 6)}.svg`,
    message: getRandomArrayElement(MESSAGES),
    name: getRandomArrayElement(NAMES)
  };
}

function getComments(val) {
  const arrComments= [];
  const commentsCount = getRandomPositiveInteger(1, val);
  for (let i = 0; i < commentsCount; i++) {
    arrComments.push(createComment());
  }
  return arrComments;
}

function createObject() {
  return {
    id: getUniqueRandomPositiveInt(1, 25, arrIdObjects),
    url: `photos/${getUniqueRandomPositiveInt(1, 25, arrIdUrls)}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomPositiveInteger (15, 200),
    comments: [getComments(10)]
  };
}

const createObjects = () => Array.from({length: SIMILAR_OBJECT_COUNT}, createObject);
export {createObjects};
