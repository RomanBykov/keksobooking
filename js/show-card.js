'use strict';

(function () {
  // показ попапа с карточкой по клику или нажатию на пин
  window.showCard = function (targetElement, cardsArray) {
    var target = targetElement;

    cardsArray.forEach(function (popupElement) {
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
})();
