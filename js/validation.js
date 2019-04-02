'use strict';

(function () {
  // установка невалидного состояния элемента
  var setInvalidState = function (element) {
    element.style.border = '3px solid #FF6347';
  };

  // установка валидного состояния элемента
  var setValidState = function (element) {
    element.style.border = 'none';
  };

  // событие валидации формы
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

  window.validation = {
    inputInvalidHandler: inputInvalidHandler
  };
})();
