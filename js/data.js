'use strict';

(function () {
  var OFFER_DESCRIPTION = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var CHECKS_TIMES = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var HOUSING_TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;
  var prices = [1000, 0, 5000, 10000];

  // получение типов жилья в карточках
  var getOfferType = function (type) {
    return HOUSING_TYPES[type];
  };

  // генерация самих карточек
  var createCards = function (cardsArray, quantity) {
    var housingTypesKeys = Object.keys(HOUSING_TYPES);
    var checkTimes = CHECKS_TIMES[window.util.getRandomNumber(0, CHECKS_TIMES.length)];

    for (var i = 0; i < quantity; i++) {
      var locationX = window.util.getRandomNumber(320, 920);
      var locationY = window.util.getRandomNumber(138, 538);

      cardsArray[i] = {
        author: {
          avatar: 'img/avatars/user0' + (1 + i) + '.png'
        },
        offer: {
          title: OFFER_DESCRIPTION[i],
          address: locationX + ', ' + locationY,
          price: window.util.getRandomNumber(MIN_PRICE, MAX_PRICE),
          type: getOfferType(housingTypesKeys[window.util.getRandomNumber(0, housingTypesKeys.length)]),
          rooms: window.util.getRandomNumber(MIN_ROOMS, MAX_ROOMS),
          guests: window.util.getRandomNumber(MIN_GUESTS, MAX_GUESTS),
          checkin: checkTimes,
          checkout: checkTimes,
          features: window.util.getRandomFeatures(OFFER_FEATURES),
          description: '',
          photos: []
        },
        location: {
          x: locationX,
          y: locationY
        }
      };
    }

    return cardsArray;
  };

  window.data = {
    createCards: createCards,
    prices: prices,
    HOUSING_TYPES: HOUSING_TYPES
  };
})();
