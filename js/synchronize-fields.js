'use strict';

(function () {
  window.synchronizeFields = function (elementIn, elementOut, dataIn, dataOut, callback) {
    elementIn.addEventListener('change', function () {
      var resultValue = '';
      for (var i = 0; i < dataIn.length; i++) {
        if (elementIn[i].selected) {
          resultValue = dataOut[i];
        }
      }

      if (typeof callback === 'function') {
        callback(elementOut, resultValue);
      }
    });
  };
})();
