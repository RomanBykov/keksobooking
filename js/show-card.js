'use strict';

(function () {
  var mapPins = document.querySelector('.map__pins');
  var pinButtons = [];
  var cardsPopups = [];
  var closePopupButtons = [];

  // показ попапа с карточкой по клику или нажатию на пин
  var showCard = function (targetElement, cardsArray) {
    var target = targetElement;
    var pinTailLength = 10;

    cardsArray.forEach(function (popupElement) {
      popupElement.classList.add('hidden');

      if (targetElement.firstChild) {
        target = targetElement.firstChild;
      }

      var cardImageSrc = popupElement.firstElementChild.src.substring(popupElement.firstElementChild.src.length - pinTailLength);
      var pinImageSrc = target.src.substring(target.src.length - pinTailLength);

      if (cardImageSrc === pinImageSrc) {
        popupElement.classList.remove('hidden');
      }
    });
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
    showCard(target, cardsPopups);
    document.addEventListener('keydown', escPressHandler);
  };

  // скрытие попапа и снятие выделения с пина по клику на крестик
  var closePopupButtonClickHandler = function (evt) {
    var target = evt.target;
    target.parentNode.classList.add('hidden');
    cleanPins();
  };

  // поиск пинов с добавлением событий
  var findAndShowPins = function () {
    pinButtons = Array.from(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
    cardsPopups = Array.from(document.querySelectorAll('.popup'));
    closePopupButtons = Array.from(document.querySelectorAll('.popup__close'));
    // добавление событий по клику на пины
    pinButtons.forEach(function (pinElement) {
      pinElement.addEventListener('click', pinClickHandler);
    });

    for (var i = 0; i < closePopupButtons.length; i++) {
      closePopupButtons[i].addEventListener('click', closePopupButtonClickHandler);
    }
  };


  window.setObserver(findAndShowPins, mapPins);

  window.showCard = {
    showCard: showCard,
    pinButtons: pinButtons,
    cardsPopups: cardsPopups,
    closePopupButtons: closePopupButtons,
    cleanPins: cleanPins
  };
})();
