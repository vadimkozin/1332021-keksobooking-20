'use strict';
window.move = (function () {
  /**
   * Инициализация передвижения объекта
   * @param {HTMLElement} movableObject - передвигаемый объект
   * @param {HTMLElement} handle - ручка для перетаскивания, элемент внутри movableObject
   * @param {object} options - опции:
   *    @param {boolean} isReturnAsItWas - вернуть как было? после перетаскивания
   *    @param {number} zIndex - z-index объекта на время передвижения?
   *    @param {object} size - размер площадки для перетаскивания (size:{width, hight})
   *    @param {number} objHeight - высота передвигаемого объекта,
   *    @param {number} objWidth - ширина передвигаемого объекта,
   *
   * @param {function} cbBegin - вызывается при первом 'прикасании' к объекту
   * @param {function} cbMoving - вызывается при каждом перемещении объекта
   */

  function init(movableObject, handle, options, cbBegin, cbMoving) {

    // Если высота/ширина объекта перетаскивания заданы, то беруться они, иначе вычисляются
    options.isReturnAsItWas = options.isReturnAsItWas ? options.isReturnAsItWas : false;
    options.zIndex = options.zIndex ? options.zIndex : 100;
    options.objHeight = options.objHeight ? options.objHeight : movableObject.offsetHeight;
    options.objWidth = options.objWidth ? options.objWidth : movableObject.offsetWidth;


    if (!(cbBegin && typeof cbBegin === 'function')) {
      cbBegin = null;
    }

    var one = {
      touch: false,
      callback: (cbBegin && typeof cbBegin === 'function') ? cbBegin : null,
    };

    if (!(cbMoving && typeof cbMoving === 'function')) {
      cbMoving = null;
    }

    // ограничения в перетаскивании
    var leftMin = -(movableObject.offsetWidth / 2);
    var leftMax = options.size.width - (options.objWidth / 2);
    var topMin = -(options.objWidth / 2);
    var topMax = options.size.height - (options.objHeight);

    var style = getComputedStyle(movableObject);

    // изначальные координаты передвигаемого объекта
    // в них нужно вернуть объект при отпускании мыши если isReturnAsItWas=true
    var originalCoords = {
      left: style.left,
      top: style.top
    };

    // изначальный z-index передвигаемого объекта
    var zIndexSave = style.zIndex;

    handle.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      // применение функции один раз
      if (!one.touch) {
        one.touch = true;
        if (one.callback) {
          one.callback();
        }
      }

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      // var dragged = false;

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        // dragged = true;
        movableObject.style.zIndex = options.zIndex;

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var top = movableObject.offsetTop - shift.y;
        var left = movableObject.offsetLeft - shift.x;

        left = left < leftMin ? leftMin : left;
        left = left > leftMax ? leftMax : left;
        top = top < topMin ? topMin : top;
        top = top > topMax ? topMax : top;

        movableObject.style.top = top + 'px';
        movableObject.style.left = left + 'px';

        if (cbMoving) {
          cbMoving();
        }
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // if (dragged) {
        //   var onClickPreventDefault = function (clickEvt) {
        //     clickEvt.preventDefault();
        //     handle.removeEventListener('click', onClickPreventDefault);
        //   };
        //   handle.addEventListener('click', onClickPreventDefault);
        // }

        if (options.isReturnAsItWas) {
          movableObject.style.top = originalCoords.top;
          movableObject.style.left = originalCoords.left;
        }

        movableObject.style.zIndex = zIndexSave;

      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  return {
    init: init
  };

})();
