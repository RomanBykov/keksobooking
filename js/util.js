'use strict';

(function () {
  var ESC_KEY = 27;
  var ENTER_KEY = 13;

  // Служебные функции
  var getRandomNumber = function (minNumber, maxNumber) {
    return Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
  };

  // вариация тасования по алгоритму Фишера-Йетса
  var shuffle = function (array) {
    var j;
    var temp;
    for (var i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array;
  };

  // рандомная генерация features в карточках
  var getRandomFeatures = function (features) {
    var featuresArray = shuffle(features).slice(0, getRandomNumber(1, features.length + 1));
    return featuresArray;
  };

  // переключатель видимости элементов формы
  var isElementsInvisible = function (list, booleanTrue) {
    for (var i = 0; i < list.length; i++) {
      list[i].disabled = booleanTrue;
    }
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomFeatures: getRandomFeatures,
    isElementsInvisible: isElementsInvisible,
    ESC_KEY: ESC_KEY,
    ENTER_KEY: ENTER_KEY
  };
})();
