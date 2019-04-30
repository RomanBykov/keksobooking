'use strict';

(function () {
  var MAX_PINS_NUMBER = 5;
  var mapPins = document.querySelector('.map__pins');

  window.render = function (data) {
    var fragment = document.createDocumentFragment();
    var takeNumber = data.length > MAX_PINS_NUMBER ? MAX_PINS_NUMBER : data.length;

    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(window.renderCard(data[i]));
      fragment.appendChild(window.renderPin(data[i]));
    }

    mapPins.appendChild(fragment);
  };
})();
