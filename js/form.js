'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var noticeForm = document.querySelector('.notice__form');
  var formElements = noticeForm.querySelectorAll('.form__element');
  var formHeader = noticeForm.querySelector('.notice__header');
  var formTimeIn = noticeForm.querySelector('#timein');
  var formTimeOut = noticeForm.querySelector('#timeout');
  var formTitle = noticeForm.querySelector('#title');
  var formType = noticeForm.querySelector('#type');
  var formPrice = noticeForm.querySelector('#price');
  var formRoomNumber = noticeForm.querySelector('#room_number');
  var formCapacity = noticeForm.querySelector('#capacity');
  var formAddress = noticeForm.querySelector('#address');
  var roomNumberValues = Array.from(formRoomNumber.querySelectorAll('option'));
  var capacityValues = Array.from(formCapacity.querySelectorAll('option'));
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.querySelectorAll('.map__filter');
  var toggledFormElements = [formElements, mapFilters, formHeader];
  var MAIN_PIN_Y_OFFSET = 16;
  var MIN_PIN_Y_COORD = 100 + MAIN_PIN_Y_OFFSET;
  var MAX_PIN_Y_COORD = 500 + MAIN_PIN_Y_OFFSET;

  // запись адреса в соответствующее поле формы
  var setAddressFormValue = function () {
    formAddress.value = getMainPinLocation();
    formAddress.placeholder = getMainPinLocation();
  };

  // установка вместимости по умолчанию
  var setDefaultCapacity = function () {
    for (var i = 0; i < roomNumberValues.length; i++) {
      if (roomNumberValues[i].selected) {
        window.util.syncValues(formCapacity, capacityValues[i]);
      }
    }
  };

  // установка первоначального адреса и координат главного пина
  var setDefaultAddress = function () {
    mainPin.style.top = '375px';
    mainPin.style.left = '50%';
    formAddress.value = getMainPinLocation();
    formAddress.placeholder = getMainPinLocation();
  };

  // сброс полей формы к изначальным
  var setFormToDefault = function () {
    setDefaultAddress();
    setDefaultCapacity();
    formTitle.value = '';
    formTitle.placeholder = 'Милая, уютная квартирка в центре Токио';
    window.util.syncValues(formType, 'flat');
    window.util.syncValueWithMin(formPrice, window.data.PRICES[0]);
    formPrice.value = '';
    formRoomNumber.value = '1';
    formCapacity.value = '1';
    window.util.syncValues(formTimeIn, window.data.CHECKS_TIMES[0]);
    window.util.syncValues(formTimeOut, window.data.CHECKS_TIMES[0]);
  };

  // определение позиции главного пина
  var getMainPinLocation = function () {
    var mainPinLocationY = parseInt(getComputedStyle(mainPin).getPropertyValue('top'), 10) - MAIN_PIN_Y_OFFSET;
    var mainPinLocationX = parseInt(getComputedStyle(mainPin).getPropertyValue('left'), 10);
    return 'x: ' + mainPinLocationX + ', y: ' + mainPinLocationY;
  };

  // перетаскивание главного пина с установкой координат в адресе формы
  var mainPinMoveHandler = function (evt) {
    evt.preventDefault();

    // получение стартовых координат
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      // смещение относительно стартовых координат
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // теперь стартовые координаты имеют новое значение
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // установка координат по 2 осям
      var setNewCoords = function (isHorizontal) {
        var result = mainPin.offsetTop - shift.y;
        if (isHorizontal) {
          result = mainPin.offsetLeft - shift.x;
        }
        return result;
      };

      // ограничение по оси Y
      var setXCoordsInRange = function (minCoord, maxCoord) {
        var result = setNewCoords();
        if (result > maxCoord) {
          result = maxCoord;
        }
        if (result < minCoord) {
          result = minCoord;
        }
        return result;
      };

      // запись новых координат в стили главного пина
      mainPin.style.top = setXCoordsInRange(MIN_PIN_Y_COORD, MAX_PIN_Y_COORD) + 'px';
      mainPin.style.left = setNewCoords(true) + 'px';
    };

    // при отпускании мыши после перетаскивания
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      setAddressFormValue(); // установка полученных данных в поле формы
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // отправка данных формы на сервер и скрытие окна настройки персонажа
  var formSubmitHandler = function (evt) {
    window.backend.save(new FormData(noticeForm), function () {
      setFormToDefault();
    }, window.backend.errorHandler);
    evt.preventDefault();
  };

  // синхронизация полей формы
  window.util.getValuesFromOptionsAndSort(capacityValues, window.util.sortWithLastZero);
  window.synchronizeFields(formTimeIn, formTimeOut, window.data.CHECKS_TIMES, window.data.CHECKS_TIMES, window.util.syncValues);
  window.synchronizeFields(formType, formPrice, Object.keys(window.data.HOUSING_TYPES), window.data.PRICES, window.util.syncValueWithMin);
  window.synchronizeFields(formRoomNumber, formCapacity, roomNumberValues, capacityValues, window.util.syncValues);

  // добавление событий
  mainPin.addEventListener('mousedown', mainPinMoveHandler);
  formTitle.addEventListener('invalid', window.validation.inputInvalidHandler);
  formPrice.addEventListener('invalid', window.validation.inputInvalidHandler);
  noticeForm.addEventListener('submit', formSubmitHandler);

  window.form = {
    noticeForm: noticeForm,
    toggledFormElements: toggledFormElements,
    setAddressFormValue: setAddressFormValue,
    mainPin: mainPin,
    setDefaultCapacity: setDefaultCapacity
  };
})();
