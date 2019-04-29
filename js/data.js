'use strict';

(function () {
  var CHECKS_TIMES = ['12:00', '13:00', '14:00'];
  var HOUSING_TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };

  var PRICES = [1000, 0, 5000, 10000];

  window.data = {
    PRICES: PRICES,
    HOUSING_TYPES: HOUSING_TYPES,
    CHECKS_TIMES: CHECKS_TIMES
  };
})();
