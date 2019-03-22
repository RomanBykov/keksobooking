'use strict';

var map = document.querySelector('.map');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapPins = map.querySelector('.map__pins');
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
var cardsQuantity = 8;
var mapCards = new Array(cardsQuantity);

// Служебные функции
var getRandomNumber = function (minNumber, maxNumber) {
  return Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
};

var shuffle = function (array) {
  var j;
  var temp;
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

var getRandomFeatures = function (features) {
  var featuresArray = shuffle(features).slice(0, getRandomNumber(1, features.length + 1));
  return featuresArray;
};
//

// Функции для генерации карточек
var getOfferType = function (type) {
  return HOUSING_TYPES[type];
};

var createCards = function (cardsArray, quantity) {
  var housingTypesKeys = Object.keys(HOUSING_TYPES);

  for (var i = 0; i < quantity; i++) {
    cardsArray[i] = {
      author: {
        avatar: 'img/avatars/user0' + (1 + i) + '.png'
      },
      offer: {
        title: OFFER_DESCRIPTION[i],
        address: getRandomNumber(320, 920) + ', ' + getRandomNumber(120, 520),
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: housingTypesKeys,
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: CHECKS_TIMES[getRandomNumber(0, CHECKS_TIMES.length)],
        checkout: CHECKS_TIMES[getRandomNumber(0, CHECKS_TIMES.length)],
        features: getRandomFeatures(OFFER_FEATURES),
        description: '',
        photos: []
      },
      location: {
        x: getRandomNumber(320, 920),
        y: getRandomNumber(120, 520)
      }
    };
  }

  return cardsArray;
};

var renderCard = function (card) {
  var offerType = card.offer.type[getRandomNumber(0, card.offer.type.length)];
  var cardElement = cardTemplate.cloneNode(true);
  var fragment = document.createDocumentFragment();
  var featuresList = cardElement.querySelector('.popup__features');

  var getRooms = function (rooms) {
    var roomsInString = ' комната';
    if (rooms > 1 && rooms < 5) {
      roomsInString = ' комнаты';
    }
    if (rooms > 4) {
      roomsInString = ' комнат';
    }
    return rooms + roomsInString;
  };

  var getGuest = function (guests) {
    var guestsInString = ' гостя';
    if (guests > 1) {
      guestsInString = ' гостей';
    }
    return guests + guestsInString;
  };

  // создание фрагмента для вставки в features
  for (var i = 0; i < card.offer.features.length; i++) {
    var featuresElement = document.createElement('li');
    featuresElement.className = 'feature feature--' + card.offer.features[i];
    fragment.appendChild(featuresElement);
  }

  // очистка features для будущей вставки фрагмента
  while (featuresList.firstChild) {
    featuresList.removeChild(featuresList.firstChild);
  }

  cardElement.querySelector('img').src = card.author.avatar;
  cardElement.querySelector('h3').textContent = card.offer.title;
  cardElement.querySelector('p').textContent = card.offer.address;
  cardElement.querySelector('.popup__price').textContent = card.offer.price + ' ₽/ночь';
  cardElement.querySelector('h4').textContent = getOfferType(offerType);
  cardElement.querySelector('p:nth-of-type(3)').textContent = getRooms(card.offer.rooms) + ' для ' + getGuest(card.offer.guests);
  cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__features').appendChild(fragment);
  cardElement.querySelector('p:last-of-type').textContent = card.offer.description;

  return cardElement;
};

var insertCards = function (cardsArr, destinationElement, count) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    fragment.appendChild(renderCard(cardsArr[i]));
  }

  return destinationElement.appendChild(fragment);
};
//

var startState = function () {
  map.classList.remove('map--faded');
};

startState();
createCards(mapCards, cardsQuantity);
insertCards(mapCards, mapPins, cardsQuantity);
