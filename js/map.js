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

  // скрытие пинов и формы
  var deactivateMap = function () {
    window.backend.load(insertCardElements, window.backend.errorHandler);
    map.classList.add('map--faded');
    window.form.noticeForm.classList.add('notice__form--disabled');
    window.form.toggledFormElements.forEach(function (element) {
      window.util.isElementsInvisible(element, true);
    });
  };

  // показ пинов и формы
  var activateMap = function () {
    // после загрузки с сервера находим пины, карточки объявлений и кнопки закрытия карточек
    pinButtons = Array.from(mapPins.querySelectorAll('.map__pin:not(.map__pin--main)'));
    cardsPopups = Array.from(document.querySelectorAll('.popup'));
    closePopupButtons = Array.from(document.querySelectorAll('.popup__close'));
    // открываем карту
    map.classList.remove('map--faded');
    window.form.noticeForm.classList.remove('notice__form--disabled');
    // показываем все пины
    pinButtons.forEach(function (pinButton) {
      pinButton.classList.remove('hidden');
    });
    // активируем форму и фильтры
    window.form.toggledFormElements.forEach(function (element) {
      window.util.isElementsInvisible(element, false);
    });
    // устанавливаем значения по умолчанию
    window.form.setDefaultCapacity();
    // добавляем события на пины и кнопки закрытия карточек
    addClickListenersToPins(pinButtons);
    addClosePopupButtonClickHandlers();
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
    if (target.firstChild) { // ..если событие сработало на button (родителе), то у элемента есть чайлд, и таргет становится этим чайлдом..
      target = target.firstChild;
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

  // первым делом дактивируем карту и форму с фильтрами, затем добавляем событие на клик по главному пину
  deactivateMap();
  window.form.mainPin.addEventListener('mouseup', activateMap);
})();
