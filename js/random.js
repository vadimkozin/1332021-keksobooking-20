'use strict';

// функции для разных 'случайных' вещей

window.random = (function () {
  return {

    getIndex: function (array) {
      return Math.floor(Math.random() * array.length); // range: 0.. array.length
    },

    getItemFromArray: function (array) {
      return array[this.getIndex(array)];
    },

    getArrayFromArray: function (array) {

      var result = [];

      var count = this.getNumberFromRange(1, array.length);

      for (var i = 0; i < count; i++) {
        var index = this.getIndex(array);
        if (result.indexOf(array[index]) === -1) {
          result.push(array[index]);
        }
      }

      return result;
    },

    getNumberFromRange: function (from, to) {
      var range = Number(to) - Number(from) + 1;
      return from + Math.floor(Math.random() * range);
    },

    // создаёт массив пар
    // address.{fromX:100, toX:1000, fromY:50, toY:500, size:5} => ['100,50', '500,60', '900,100', '700,400', '655, 499']
    createArrayPairs: function (address) {
      var array = [];

      for (var i = 0; i < address.SIZE; i++) {
        var x = this.getNumberFromRange(address.FROM_X, address.TO_X);
        var y = this.getNumberFromRange(address.FROM_X, address.TO_Y);
        var item = String(x + ',' + y);
        array.push(item);
      }

      return array;
    }
  };

})();
