'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // отрисовка пинов
  var renderPin = function (card) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = card.location.x + 'px';
    pinElement.style.top = card.location.y + 'px';
    pinElement.querySelector('.map__pin img').src = card.author.avatar;

    return pinElement;
  };

  window.pin = {
    renderPin: renderPin
  };
})();
