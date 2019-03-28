'use strict';

var map = document.querySelector('.map');
var template = document.querySelector('template');
var cardTemplate = template.content.querySelector('.map__card');
var pinTemplate = template.content.querySelector('.map__pin');
var mapPins = map.querySelector('.map__pins');
var noticeForm = document.querySelector('.notice__form');
var formElements = noticeForm.querySelectorAll('.form__element');
var formHeader = noticeForm.querySelector('.notice__header');
var mapFiltersForm = document.querySelector('.map__filters');
var mapFilters = mapFiltersForm.querySelectorAll('.map__filter');
var mainPin = document.querySelector('.map__pin--main');
var formTimeIn = noticeForm.querySelector('#timein');
var formTitle = noticeForm.querySelector('#title');
var formTimeOut = noticeForm.querySelector('#timeout');
var formType = noticeForm.querySelector('#type');
var formTypeOptions = Array.from(formType.querySelectorAll('option'));
var formPrice = noticeForm.querySelector('#price');
var formRoomNumber = noticeForm.querySelector('#room_number');
// var formCapacity = noticeForm.querySelector('#capacity');
var formAddress = noticeForm.querySelector('#address');
var roomNumberValues = Array.from(noticeForm.querySelectorAll('#room_number option'));
var capacityValues = Array.from(noticeForm.querySelectorAll('#capacity option'));
var prices = [1000, 0, 5000, 10000];
var toggledFormElements = [formElements, mapFilters, formHeader];
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
var ESC_KEY = 27;
// var ENTER_KEY = 13;
var cardsQuantity = 8;
var mapCards = new Array(cardsQuantity);

// Служебные функции
var getRandomNumber = function (minNumber, maxNumber) {
  return Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
};

// вариация тасования по алгоритму Фишера-Йетса
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
  var checkTimes = CHECKS_TIMES[getRandomNumber(0, CHECKS_TIMES.length)];

  for (var i = 0; i < quantity; i++) {
    var locationX = getRandomNumber(320, 920);
    var locationY = getRandomNumber(120, 520);

    cardsArray[i] = {
      author: {
        avatar: 'img/avatars/user0' + (1 + i) + '.png'
      },
      offer: {
        title: OFFER_DESCRIPTION[i],
        address: locationX + ', ' + locationY,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: housingTypesKeys,
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: checkTimes,
        checkout: checkTimes,
        features: getRandomFeatures(OFFER_FEATURES),
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

var renderPin = function (card) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = card.location.x + 'px';
  pinElement.style.top = card.location.y + 'px';
  pinElement.querySelector('.map__pin img').src = card.author.avatar;

  return pinElement;
};

var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);
  var fragment = document.createDocumentFragment();
  var featuresList = cardElement.querySelector('.popup__features');
  var offerType = card.offer.type[getRandomNumber(0, card.offer.type.length)];

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
  cardElement.classList.add('hidden');

  return cardElement;
};

var insertPins = function (pinsArr, destinationElement, count) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    fragment.appendChild(renderPin(pinsArr[i]));
  }

  return destinationElement.appendChild(fragment);
};

var insertCards = function (cardsArr, destinationElement, count) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    fragment.appendChild(renderCard(cardsArr[i]));
  }

  return destinationElement.appendChild(fragment);
};

createCards(mapCards, cardsQuantity);
insertPins(mapCards, mapPins, cardsQuantity);
insertCards(mapCards, mapPins, cardsQuantity);

// module4-task1

var pinButtons = Array.from(mapPins.querySelectorAll('.map__pin:not(.map__pin--main)')); // обязательно после insertPins()
var cardsPopups = Array.from(document.querySelectorAll('.popup')); // обязательно после insertCards()
var closePopupButtons = document.querySelectorAll('.popup__close'); // обязательно после insertCards()

var toggleElementsVisibility = function (list, booleanTrue) {
  for (var i = 0; i < list.length; i++) {
    list[i].disabled = booleanTrue;
  }
};

// скрывает пины и деактивирует формы
var deactivateMap = function () {
  map.classList.add('map--faded');
  noticeForm.classList.add('notice__form--disabled');
  pinButtons.forEach(function (pinButton) {
    pinButton.classList.add('hidden');
  });
  toggledFormElements.forEach(function (element) {
    toggleElementsVisibility(element, true);
  });
};

// делает наоборот
var activateMap = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  pinButtons.forEach(function (pinButton) {
    pinButton.classList.remove('hidden');
  });
  toggledFormElements.forEach(function (element) {
    toggleElementsVisibility(element);
  });
  setDefaultAddress();
};

// очищает пины от активного маркера
var cleanPins = function () {
  pinButtons.forEach(function (pinButton) {
    pinButton.classList.remove('map__pin--active');
  });
};

// открывает попап по клику или нажатию
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

// очищает пины и прячет попап
var closePopup = function () {
  cardsPopups.forEach(function (popupElement) {
    if (!popupElement.classList.contains('hidden')) {
      popupElement.classList.add('hidden');
    }
  });
  cleanPins();
};

// закрытие по нажатию
var escPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEY) {
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

var getActivePinAndPopup = function (pinsArray) {
  pinsArray.forEach(function (pinElement) {
    pinElement.addEventListener('click', pinClickHandler);
  });
};

var closeButtonClickHandler = function (evt) {
  var target = evt.target;
  target.parentNode.classList.add('hidden');
  cleanPins();
};

var addCloseClickHandlers = function () {
  for (var i = 0; i < closePopupButtons.length; i++) {
    closePopupButtons[i].addEventListener('click', closeButtonClickHandler);
  }
};

// module4-task2
var formTimeChangeHandler = function () {
  formTimeOut.value = formTimeIn.value;
};

// считываем css свойства top И left, чтобы определить позицию главного пина
var getMainPinLocation = function () {
  var MAIN_PIN_Y_OFFSET = 16;
  var mainPinLocationY = parseInt(getComputedStyle(mainPin).getPropertyValue('top'), 10) - MAIN_PIN_Y_OFFSET;
  var mainPinLocationX = parseInt(getComputedStyle(mainPin).getPropertyValue('left'), 10);
  return 'x: ' + mainPinLocationX + ', y: ' + mainPinLocationY;
};

var setDefaultAddress = function () {
  formAddress.value = getMainPinLocation();
  formAddress.placeholder = getMainPinLocation();
};

var changeFormPrice = function (price) {
  formPrice.min = price;
  formPrice.placeholder = price;
};

var formTypeChangeHandler = function () {
  for (var i = 0; i < formTypeOptions.length; i++) {
    if (formTypeOptions[i].selected) {
      changeFormPrice(prices[i]);
    }
  }
};

var syncCapacityWithRooms = function () {
  for (var i = 0; i < roomNumberValues.length; i++) { // в цикле по комнатам находим выбранное количество комнат
    if (roomNumberValues[i].selected) {
      for (var j = 0; j < capacityValues.length; j++) { // в цикле по количествам гостей на комнаты проверяем совпадения с комнатами
        if (capacityValues[j].value === roomNumberValues[i].value) { // если значение количества гостей совпадает с количеством комнат, то выбираем это количество гостей
          capacityValues[j].selected = true;
        } else if (roomNumberValues[i].value === '100') { // отдельно сопоставляем 100 комнат с "не для гостей"
          capacityValues[j].selected = true;
        }
      }
    }
  }
};

var setInvalidState = function (element) {
  element.style.border = '3px solid #FF6347';
};

var setValidState = function (element) {
  element.style.border = 'none';
};

var inputInvalidHandler = function (evt) {
  if (evt.target.validity.valueMissing) {
    evt.target.setCustomValidity('Пожалуйста, заполните поле');
    setInvalidState(evt.target);
  } else if (evt.target.validity.tooShort) {
    evt.target.setCustomValidity('Минимум 30 символов');
    setInvalidState(evt.target);
  } else if (evt.target.validity.tooLong) {
    evt.target.setCustomValidity('Максимум 100 символов');
    setInvalidState(evt.target);
  } else {
    evt.target.setCustomValidity('');
    setValidState(evt.target);
  }
};

addCloseClickHandlers();
deactivateMap();
getActivePinAndPopup(pinButtons);
syncCapacityWithRooms();

mainPin.addEventListener('mouseup', activateMap);
formType.addEventListener('change', formTypeChangeHandler);
formTimeIn.addEventListener('change', formTimeChangeHandler);
formRoomNumber.addEventListener('change', syncCapacityWithRooms);
formTitle.addEventListener('invalid', inputInvalidHandler);
formPrice.addEventListener('invalid', inputInvalidHandler);
