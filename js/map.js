'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var cardsQuantity = 8;
  var mapCards = new Array(cardsQuantity);

  // вставка заранее сгенерированных и отрисованных пинов в выбранный элемент на странице
  var insertPins = function (pinsArr, destinationElement, count) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      fragment.appendChild(window.pin.renderPin(pinsArr[i]));
    }

    return destinationElement.appendChild(fragment);
  };

  // вставка заранее сгенерированных и отрисованных карточек в выбранный элемент на странице
  var insertCards = function (cardsArr, destinationElement, count) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      fragment.appendChild(window.card.renderCard(cardsArr[i]));
    }

    return destinationElement.appendChild(fragment);
  };

  window.data.createCards(mapCards, cardsQuantity);
  insertPins(mapCards, mapPins, cardsQuantity);
  insertCards(mapCards, mapPins, cardsQuantity);

  var pinButtons = Array.from(mapPins.querySelectorAll('.map__pin:not(.map__pin--main)')); // обязательно после insertPins()
  var cardsPopups = Array.from(document.querySelectorAll('.popup')); // обязательно после insertCards()
  var closePopupButtons = document.querySelectorAll('.popup__close'); // обязательно после insertCards()

  // скрытие пинов и формы
  var deactivateMap = function () {
    map.classList.add('map--faded');
    window.form.noticeForm.classList.add('notice__form--disabled');
    pinButtons.forEach(function (pinButton) {
      pinButton.classList.add('hidden');
    });
    window.form.toggledFormElements.forEach(function (element) {
      window.util.isElementsInvisible(element, true);
    });
  };

  // показ пинов и формы
  var activateMap = function () {
    map.classList.remove('map--faded');
    window.form.noticeForm.classList.remove('notice__form--disabled');
    pinButtons.forEach(function (pinButton) {
      pinButton.classList.remove('hidden');
    });
    window.form.toggledFormElements.forEach(function (element) {
      window.util.isElementsInvisible(element, false);
    });
    window.form.setDefaultAddress();
  };

  // очистка всех пинов от активного маркера
  var cleanPins = function () {
    pinButtons.forEach(function (pinButton) {
      pinButton.classList.remove('map__pin--active');
    });
  };

  // показ попапа с карточкой по клику или нажатию на пин
  var showPopup = function (targetElement) {
    var target = targetElement;

    cardsPopups.forEach(function (popupElement) {
      popupElement.classList.add('hidden');
      if (targetElement.firstChild) {
        target = targetElement.firstChild;
      }

      var cardImageSrc = popupElement.firstElementChild.src.substring(popupElement.firstElementChild.src.length - 10);
      var pinImageSrc = target.src.substring(target.src.length - 10);

      if (cardImageSrc === pinImageSrc) {
        popupElement.classList.remove('hidden');
      }
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
    showPopup(target);
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

  addClosePopupButtonClickHandlers();
  deactivateMap();
  addClickListenersToPins(pinButtons);
  window.form.mainPin.addEventListener('mouseup', activateMap);
})();
