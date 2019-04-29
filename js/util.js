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

  // синхронизация выбранных полей в форме
  var syncValues = function (elementOut, resultValue) {
    elementOut.value = resultValue;
  };

  // синхронизация выбранных полей в форме
  var syncValueWithMin = function (elementOut, resultValue) {
    elementOut.min = resultValue;
    elementOut.placeholder = resultValue;
    elementOut.value = resultValue;
  };

  // извлечение value из массива option
  var getValuesFromOptionsAndSort = function (arr, callback) {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].value;
    }

    if (typeof callback === 'function') {
      callback(arr);
    }
  };

  // сортировка чисел по возрастанию с 0 в конце результата
  var sortWithLastZero = function (arr) {
    arr.sort(function (a, b) {
      return a - b;
    });
    return arr.push(arr.shift());
  };

  var cleanDOMPins = function (arrayOfPins, arrayOfCards) {
    if (arrayOfPins.length > 0) {
      for (var i = 0; i < arrayOfPins.length; i++) {
        arrayOfPins[i].remove();
        arrayOfCards[i].remove();
      }
    }
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomFeatures: getRandomFeatures,
    isElementsInvisible: isElementsInvisible,
    ESC_KEY: ESC_KEY,
    ENTER_KEY: ENTER_KEY,
    syncValues: syncValues,
    syncValueWithMin: syncValueWithMin,
    getValuesFromOptionsAndSort: getValuesFromOptionsAndSort,
    sortWithLastZero: sortWithLastZero,
    cleanDOMPins: cleanDOMPins
  };
})();
