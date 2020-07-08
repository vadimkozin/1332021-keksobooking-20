'use strict';
// «устранения дребезга»

window.debounce = (function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  return function (cb, element) {

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
      isWaiting = true;
      disableElement(true);

      cb.apply(null, arguments);

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = setTimeout(function () {
        isWaiting = false;
        disableElement(false);
      }, DEBOUNCE_INTERVAL);
    };
  };

})();
