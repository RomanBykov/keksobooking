'use strict';

(function () {
  var map = document.querySelector('.map');
  var housingTypes = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');
  var housingsData = [];

  var housingFeaturesList = Array.from(housingFeatures.querySelectorAll('input'));
  console.log(housingFeaturesList);

  // Отображение отфильтированных предложений
  var updateCards = function () {
    window.showCard.cleanDOMPins();

    var filteredHousings = housingsData.filter(function (item) {
      return (item.offer.type === housingTypes.value || housingTypes.value === 'any');
    });

    filteredHousings = filteredHousings.filter(function (item) {
      var resultDiapozone;
      if (housingPrice.value === 'middle') {
        resultDiapozone = (item.offer.price >= 10000 && item.offer.price <= 50000);
      } else if (housingPrice.value === 'low') {
        resultDiapozone = (item.offer.price < 10000);
      } else if (housingPrice.value === 'high') {
        resultDiapozone = (item.offer.price > 50000);
      } else {
        resultDiapozone = true;
      }
      return resultDiapozone;
    });

    filteredHousings = filteredHousings.filter(function (item) {
      return (item.offer.rooms === Number(housingRooms.value) || housingRooms.value === 'any');
    });

    filteredHousings = filteredHousings.filter(function (item) {
      return (item.offer.rooms === Number(housingRooms.value) || housingRooms.value === 'any');
    });

    filteredHousings = filteredHousings.filter(function (item) {
      return (item.offer.guests === Number(housingGuests.value) || housingGuests.value === 'any');
    });


    window.render(filteredHousings);
  };

  // вставка загруженных с сервера пинов и карточек в фрагмент с полследующей вставкой фрагмента на страницу
  var successHandler = function (data) {
    housingsData = data;
    updateCards();
  };

  // скрытие пинов и формы, получение данных пинов и карточек объявлений с сервера
  var deactivateMap = function () {
    map.classList.add('map--faded');
    window.form.noticeForm.classList.add('notice__form--disabled');
    window.form.toggledFormElements.forEach(function (element) {
      window.util.isElementsInvisible(element, true);
    });
  };

  // показ пинов и формы
  var activateMap = function () {
    // загрузка данных объявлений с сервера
    window.backend.load(successHandler, window.backend.errorHandler);
    // отрытие карты и формы
    map.classList.remove('map--faded');
    window.form.noticeForm.classList.remove('notice__form--disabled');
    // активируем форму и фильтры
    window.form.toggledFormElements.forEach(function (element) {
      window.util.isElementsInvisible(element, false);
    });
    // устанавливаем значения по умолчанию
    window.form.setDefaultCapacity();
    // снимаем событие активации карты с главного пина, т.к. оно должно срабатывать один раз
    window.form.mainPin.removeEventListener('mouseup', activateMap);
  };

  /* первым делом деактивируем карту и форму с фильтрами, добавим наблюдателя,
    добавим событие на клик по главному пину и по этому событию загрузим с данные сервера */
  deactivateMap();
  window.form.mainPin.addEventListener('mouseup', activateMap);
  housingTypes.addEventListener('change', updateCards);
  housingPrice.addEventListener('change', updateCards);
  housingRooms.addEventListener('change', updateCards);
  housingGuests.addEventListener('change', updateCards);
})();
