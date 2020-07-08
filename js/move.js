'use strict';
window.move = (function () {
  /**
   * Инициализация передвижения объекта
   * @param {HTMLElement} movableObject - передвигаемый объект
   * @param {HTMLElement} handle - ручка для перетаскивания, элемент внутри movableObject
   * @param {object} options - опции: *
   * @param {function} cbBegin - вызывается при первом 'прикосновении' к объекту
   * @param {function} cbMoving - вызывается при каждом перемещении объекта
   *    options:
   *    @param {boolean} isReturnAsItWas - вернуть как было? после перетаскивания
   *    @param {number} zIndex - z-index объекта на время передвижения?
   *    @param {object} size - размер площадки для перетаскивания (size:{width, hight})
   *    @param {number} objHeight - высота передвигаемого объекта,
   *    @param {number} objWidth - ширина передвигаемого объекта,
   */
  function init(movableObject, handle, options, cbBegin, cbMoving) {

    // options - объект, его лучше склонировать чтобы случайно не испортить
    var opts = JSON.parse(JSON.stringify(options));
    opts.isReturnAsItWas = (opts.isReturnAsItWas === undefined) ? false : opts.isReturnAsItWas;
    opts.zIndex = opts.zIndex || 100;

    // Если высота/ширина объекта перетаскивания заданы, то беруться они, иначе вычисляются
    opts.objHeight = opts.objHeight || movableObject.offsetHeight;
    opts.objWidth = opts.objWidth || movableObject.offsetWidth;

    if (typeof cbBegin !== 'function') {
      cbBegin = null;
    }

    if (typeof cbMoving !== 'function') {
      cbMoving = null;
    }

    // объект для применения callback ОДИН раз
    var one = {
      touch: false,
      callback: cbBegin,
    };

    // ограничения в перетаскивании
    var leftMin = -(movableObject.offsetWidth / 2);
    var leftMax = opts.size.width - (opts.objWidth / 2);
    var topMin = -(opts.objWidth / 2);
    var topMax = opts.size.height - (opts.objHeight);

    var style = getComputedStyle(movableObject);

    // изначальные координаты передвигаемого объекта
    // в них нужно вернуть объект при отпускании мыши если isReturnAsItWas=true
    var originalCoords = {
      left: style.left,
      top: style.top
    };

    // изначальный z-index передвигаемого объекта
    var zIndexSave = style.zIndex;

    // для предохранения от повторного вызова init() регестрирую событие как 'onmousedown'
    // чтобы слушатель события 'mousedown' был только один
    handle.onmousedown = onMouseDown;

    function onMouseDown(evt) {

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

      function onMouseMove(moveEvt) {
        moveEvt.preventDefault();

        movableObject.style.zIndex = opts.zIndex;

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
      }

      function onMouseUp(upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (opts.isReturnAsItWas) {
          movableObject.style.top = originalCoords.top;
          movableObject.style.left = originalCoords.left;
        }

        movableObject.style.zIndex = zIndexSave;

      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

    }
  }

  return {
    init: init,
  };

})();
