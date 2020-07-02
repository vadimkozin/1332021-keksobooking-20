'use strict';
// «устранения дребезга»

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  window.debounce = function (cb, element) {

    var isWaiting = false;
    var timer = null;

    function disableElement(value) {
      if (element && 'disabled' in element) {
        element.disabled = value;
      }
    }

    return function () {
      if (isWaiting) {
        return;
      }

      disableElement(isWaiting = true);

      cb.apply(null, arguments);

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = setTimeout(function () {
        disableElement(isWaiting = false);
      }, DEBOUNCE_INTERVAL);
    };
  };

})();
