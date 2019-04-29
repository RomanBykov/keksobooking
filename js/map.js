'use strict';

(function () {
  var map = document.querySelector('.map');

  var housingTypes = document.querySelector('#housing-type');
  // var housingPrice = document.querySelector('#housing-price');
  // var pinButtons = [];
  // var cardsPopups = [];
  // var closePopupButtons = [];
  var housingsData = [];

  // Удаление пинов с карточками из ДОМ


  // Отображение отфильтированных предложений
  var updateCards = function () {
    window.util.cleanDOMPins(window.showCard.pinButtons, window.showCard.cardsPopups);

    var filteredHousings = housingsData.filter(function (item) {
      return (item.offer.type === housingTypes.value || housingTypes.value === 'any');
    });

    window.render(filteredHousings);
  };

  // вставка загруженных с сервера пинов и карточек в фрагмент с полследующей вставкой фрагмента на страницу
  var successHandler = function (data) {
    housingsData = data;
    updateCards();
  };

  // после загрузки с сервера находим пины, карточки объявлений и кнопки закрытия карточек
  // var findLoadedPinsAndCards = function () {
  //   pinButtons = Array.from(mapPins.querySelectorAll('.map__pin:not(.map__pin--main)'));
  //   cardsPopups = Array.from(document.querySelectorAll('.popup'));
  //   closePopupButtons = Array.from(document.querySelectorAll('.popup__close'));
  // };



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
})();
