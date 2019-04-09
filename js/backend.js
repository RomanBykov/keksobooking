'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var STATUS_OK = 200;
  var TIMEOUT_MS = 5000;

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_MS;

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    return xhr;
  };

  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);
      xhr.open('POST', URL);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);
      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'position: absolute; z-index: 100; left: 0; right: 0; margin: 0 auto; font-size: 30px; color: white; text-align: center; background-color: red;';
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
