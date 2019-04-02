'use strict';

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

  // отрисовка карточек
  var renderCard = function (card) {
    var cardElement = cardTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();
    var featuresList = cardElement.querySelector('.popup__features');

    var getRoomsEnding = function (rooms) {
      var roomsInString = ' комната';
      if (rooms > 1 && rooms < 5) {
        roomsInString = ' комнаты';
      }
      if (rooms > 4) {
        roomsInString = ' комнат';
      }
      return rooms + roomsInString;
    };

    var getGuestsEnding = function (guests) {
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
    cardElement.querySelector('h4').textContent = card.offer.type;
    cardElement.querySelector('p:nth-of-type(3)').textContent = getRoomsEnding(card.offer.rooms) + ' для ' + getGuestsEnding(card.offer.guests);
    cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    cardElement.querySelector('.popup__features').appendChild(fragment);
    cardElement.querySelector('p:last-of-type').textContent = card.offer.description;
    cardElement.classList.add('hidden');

    return cardElement;
  };

  window.card = {
    renderCard: renderCard
  };
})();
