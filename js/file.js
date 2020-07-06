'use strict';
// обработчики при выборе файлов

window.file = (function () {
  /**
   * Обработчик для выбора файла
   * @param {HTMLElement} fileElement - элемент (input[type=file]) для выбора файлов
   * @param {HTMLElement} previewElement - элемент у которого заполняем src выбранным файлом
   * @param {Function} [callback] - необязательная функция обратного вызова, применяется после успешной загрузки файла как callback(result)
   * @param {Array} [fileTypes] - необязательный массив возможных типов(расширений) файлов
   */
  function handlerReadOneFile(fileElement, previewElement, callback, fileTypes) {
    var types = fileTypes || window.cfg.FILE_TYPES;

    fileElement.addEventListener('change', function () {
      var file = fileElement.files[0];
      var fileName = file.name.toLowerCase();

      var ok = types.some(function (it) {
        return fileName.endsWith(it);
      });

      if (ok) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          if (typeof callback === 'function') {
            callback(reader.result);
          } else {
            previewElement.src = reader.result;
          }
        });

        reader.readAsDataURL(file);
      }
    });

  }

  /**
   * Обработчик для множественного/одиночного выбора файлов
   * @param {HTMLElement} fileElement - элемент (input[type=file]) для выбора файлов
   * @param {Function} callback - функция обратного вызова, применяется после успешной загрузки файла как callback(result)
   * @param {Array} [fileTypes] - необязательный массив возможных типов(расширений) файлов
   */
  function handlerReadMultiFiles(fileElement, callback, fileTypes) {
    var types = fileTypes || window.cfg.FILE_TYPES;

    fileElement.addEventListener('change', function (evt) {
      // var files = fileElement.files;
      var files = evt.currentTarget.files;

      Object.keys(files).forEach(function (it) {
        var file = files[it];
        var ok = isTypeFileOk(file, types);
        if (ok) {
          var reader = new FileReader();
          reader.onload = function () {
            callback(reader.result);
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  function isTypeFileOk(file, types) {
    var fileName = file.name.toLowerCase();
    return types.some(function (it) {
      return fileName.endsWith(it);
    });
  }


  return {
    handlerReadOneFile: handlerReadOneFile,
    handlerReadMultiFiles: handlerReadMultiFiles,
  };

})();
