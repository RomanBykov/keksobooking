'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var cardsQuantity = 8;
  var pinButtons = [];
  var cardsPopups = [];
  var closePopupButtons = [];

  // вставка загруженных с сервера пинов и карточек в фрагмент с полследующей вставкой фрагмента на страницу
  var insertCardElements = function (loadedCards) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < cardsQuantity; i++) {
      fragment.appendChild(window.card.renderCard(loadedCards[i]));
      fragment.appendChild(window.pin.renderPin(loadedCards[i]));
    }
    return mapPins.appendChild(fragment);
  };

  // после загрузки с сервера находим пины, карточки объявлений и кнопки закрытия карточек
  var findLoadedPinsAndCards = function () {
    pinButtons = Array.from(mapPins.querySelectorAll('.map__pin:not(.map__pin--main)'));
    cardsPopups = Array.from(document.querySelectorAll('.popup'));
    closePopupButtons = Array.from(document.querySelectorAll('.popup__close'));
  };

  // показываем все пины
  var showPinsAndAddClickListeners = function () {
    pinButtons.forEach(function (pinButton) {
      pinButton.classList.remove('hidden');
    });
    // добавляем события на пины и кнопки закрытия карточек
    addClickListenersToPins(pinButtons);
    addClosePopupButtonClickHandlers();
  };

  // одновременный поиск и показ пинов с добавлением событий
  var findAndShowPins = function () {
    findLoadedPinsAndCards();
    showPinsAndAddClickListeners();
  };

  var setObserver = function () {
    /* наблюдатель за изменениями в map__pins, которые происходят после загрузки данных с сервера,
     чтобы затем работать с этими данными */
    var observer = new MutationObserver(findAndShowPins); // объект наблюдатель с колбэком
    // конфигурация наблюдаемых изменений
    var config = {
      childList: true
    };
    // старт наблюдения
    observer.observe(mapPins, config);
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
    window.backend.load(insertCardElements, window.backend.errorHandler);
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

  // очистка всех пинов от активного маркера
  var cleanPins = function () {
    pinButtons.forEach(function (pinButton) {
      pinButton.classList.remove('map__pin--active');
    });
  };

  // очистка пинов и скрытие попапа с карточкой
  var closePopup = function () {
    cardsPopups.forEach(function (popupElement) {
      if (!popupElement.classList.contains('hidden')) {
        popupElement.classList.add('hidden');
      }
    });
    cleanPins();
  };

  // закрытие попапа с карточкой по нажатию
  var escPressHandler = function (evt) {
    if (evt.keyCode === window.util.ESC_KEY) {
      closePopup();
    }
  };

  // здесь клик или нажатие по пину открывает попап и маркирует активный пин;
  // событие с клавиатуры фиксируется на родителе, а клик на чайлде, поэтому..
  var pinClickHandler = function (evt) {
    var target = evt.target;
    cleanPins();
    if (target.firstChild) { // ..если событие сработало на button (родителе),
      target = target.firstChild; // то значит у элемента есть чайлд, и таргет становится этим чайлдом..
    }
    target.parentNode.classList.add('map__pin--active'); // ..чтобы при любом событии задать класс родителю
    window.showCard(target, cardsPopups);
    document.addEventListener('keydown', escPressHandler);
  };

  // добавление событий по клику на пины
  var addClickListenersToPins = function (pinsArray) {
    pinsArray.forEach(function (pinElement) {
      pinElement.addEventListener('click', pinClickHandler);
    });
  };

  // скрытие попапа и снятие выделения с пина по клику на крестик
  var closePopupButtonClickHandler = function (evt) {
    var target = evt.target;
    target.parentNode.classList.add('hidden');
    cleanPins();
  };

  // добавление событий закрытия на все крестики в попапах
  var addClosePopupButtonClickHandlers = function () {
    for (var i = 0; i < closePopupButtons.length; i++) {
      closePopupButtons[i].addEventListener('click', closePopupButtonClickHandler);
    }
  };

  /* первым делом деактивируем карту и форму с фильтрами, добавим наблюдателя,
    добавим событие на клик по главному пину и по этому событию загрузим с данные сервера */
  deactivateMap();
  setObserver();
  window.form.mainPin.addEventListener('mouseup', activateMap);
})();
