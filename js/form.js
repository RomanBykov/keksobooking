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
  var formTypeOptions = Array.from(formType.querySelectorAll('option'));
  var formPrice = noticeForm.querySelector('#price');
  var formRoomNumber = noticeForm.querySelector('#room_number');
  // var formCapacity = noticeForm.querySelector('#capacity');
  var formAddress = noticeForm.querySelector('#address');
  var roomNumberValues = Array.from(noticeForm.querySelectorAll('#room_number option'));
  var capacityValues = Array.from(noticeForm.querySelectorAll('#capacity option'));
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.querySelectorAll('.map__filter');
  var toggledFormElements = [formElements, mapFilters, formHeader];

  // синхронизация времени чекина с чекаутом
  var formTimeChangeHandler = function () {
    formTimeOut.value = formTimeIn.value;
  };

  // установка адреса по умолчанию
  var setDefaultAddress = function () {
    formAddress.value = getMainPinLocation();
    formAddress.placeholder = getMainPinLocation();
  };

  // установка цены и её плейсхолдера
  var changeFormPrice = function (price) {
    formPrice.min = price;
    formPrice.placeholder = price;
  };

  // синхронизация цены и её плейсхолдера с типом жилья
  var formTypeChangeHandler = function () {
    for (var i = 0; i < formTypeOptions.length; i++) {
      if (formTypeOptions[i].selected) {
        changeFormPrice(window.data.prices[i]);
      }
    }
  };

  // синхронизация количества комнат с количеством гостей
  var syncCapacityWithRooms = function () {
    for (var i = 0; i < roomNumberValues.length; i++) { // в цикле по комнатам находим выбранное количество комнат
      if (roomNumberValues[i].selected) {
        for (var j = 0; j < capacityValues.length; j++) { // в цикле по количествам гостей на комнаты проверяем совпадения с комнатами
          if (capacityValues[j].value === roomNumberValues[i].value) { // если значение количества гостей совпадает с количеством комнат, то выбираем это количество гостей
            capacityValues[j].selected = true;
          } else if (roomNumberValues[i].value === '100') { // отдельно сопоставляем 100 комнат с "не для гостей"
            capacityValues[j].selected = true;
          }
        }
      }
    }
  };

  // определение позиции главного пина
  var getMainPinLocation = function () {
    var MAIN_PIN_Y_OFFSET = 16;
    var mainPinLocationY = parseInt(getComputedStyle(mainPin).getPropertyValue('top'), 10) - MAIN_PIN_Y_OFFSET;
    var mainPinLocationX = parseInt(getComputedStyle(mainPin).getPropertyValue('left'), 10);
    return 'x: ' + mainPinLocationX + ', y: ' + mainPinLocationY;
  };

  syncCapacityWithRooms();
  formType.addEventListener('change', formTypeChangeHandler);
  formTimeIn.addEventListener('change', formTimeChangeHandler);
  formRoomNumber.addEventListener('change', syncCapacityWithRooms);
  formTitle.addEventListener('invalid', window.validation.inputInvalidHandler);
  formPrice.addEventListener('invalid', window.validation.inputInvalidHandler);

  window.form = {
    noticeForm: noticeForm,
    toggledFormElements: toggledFormElements,
    setDefaultAddress: setDefaultAddress,
    syncCapacityWithRooms: syncCapacityWithRooms,
    mainPin: mainPin
  };
})();
