function getRandomIntValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min >= 0 && max >= 0) {
    if (min < max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const temporaryValue = min;
    min = max;
    max = temporaryValue;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return 'Ошибочно задан диапазон значений';
}
getRandomIntValue(30, 39);
getRandomIntValue(50, 39);
getRandomIntValue(0, 0);
getRandomIntValue(20, -10);
getRandomIntValue(-20, 10);
getRandomIntValue(-20, -10);
getRandomIntValue(-10, -20);
getRandomIntValue(200.78, 10.23);
getRandomIntValue(10.23, 200.78);

function checkLenghtValue(str, maxLength) {
  if (Number(str.length) <= Number(maxLength)) {
    return true;
  }
  return false;
}
checkLenghtValue('Hello world!', 15);

