'use strict';
// утилиты

window.util = (function () {
  return {
    isEscEvent: function (evt, action) {
      if (evt.key === 'Escape') {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.key === 'Enter') {
        action();
      }
    },
    isLeftMouseButtonClick: function (evt, action) {
      if (typeof evt === 'object' && evt.button === 0) {
        action();
      }
    },
    isMiddleMouseButtonClick: function (evt, action) {
      if (typeof evt === 'object' && evt.button === 1) {
        action();
      }
    },
    isRightMouseButtonClick: function (evt, action) {
      if (typeof evt === 'object' && evt.button === 2) {
        action();
      }
    },
    getElementSize: function (element) {
      return {
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    },
  };
})();
