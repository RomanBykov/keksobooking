'use strict';

(function () {
  window.setObserver = function (callback, target) {
    /* наблюдатель за изменениями в map__pins, которые происходят после загрузки данных с сервера,
     чтобы затем работать с этими данными */
    var observer = new MutationObserver(callback); // объект наблюдатель с колбэком
    // конфигурация наблюдаемых изменений
    var config = {
      childList: true
    };
    // старт наблюдения
    observer.observe(target, config);
  };
})();
