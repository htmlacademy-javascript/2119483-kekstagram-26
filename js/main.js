const SIMILAR_OBJECT_COUNT = 3;
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
const DESCRIPTION = [
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

function getRandomPositiveInteger (a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

function getRandomPositiveIntegerWithoutRepeating (a, b, arr) {
  let result = getRandomPositiveInteger (a, b);
  while (arr.includes(result)) {
    result = getRandomPositiveInteger (a, b);
  }
  arr.push(result);
  return result;
}

function getRandomArrayElement(array) {
  return array[getRandomPositiveInteger (0, MESSAGES.length - 1)];
}

function createComment() {
  return {
    id: getRandomPositiveIntegerWithoutRepeating (0, 200, arrIdComments),  //идентификаторы не должны повторятся
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
    id: getRandomPositiveIntegerWithoutRepeating(1, 25, arrIdObjects),
    url: `photos/${getRandomPositiveIntegerWithoutRepeating(1, 25, arrIdUrls)}.jpg`,
    description: getRandomArrayElement(DESCRIPTION),
    likes: getRandomPositiveInteger (15, 200),
    comments: [getComments(10)]
  };
}

Array.from({length: SIMILAR_OBJECT_COUNT}, createObject);
