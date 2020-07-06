'use strict';
// чтение image - файлов

window.reader = (function () {
  var CLASS_PHOTO_MAIN = 'ad-form__photo--main';

  // фото аватара
  var avatarElement = document.querySelector('#avatar');
  var previewAvatarElement = document.querySelector('.ad-form-header__preview img');
  var previewAvatarImageDefault = previewAvatarElement.src;
  window.file.handlerReadOneFile(avatarElement, previewAvatarElement);

  // фото жилья
  var imagesElement = document.querySelector('#images');
  var previewPhotoMainElement = document.querySelector('.ad-form__photo');
  var previewPhotoElement = previewPhotoMainElement.cloneNode(true);
  previewPhotoMainElement.classList.add(CLASS_PHOTO_MAIN);

  var style = getComputedStyle(previewPhotoMainElement);

  var containerElement = document.querySelector('.ad-form__photo-container');
  var countPhoto = 1;

  function onFileRead(result) {
    previewPhotoMainElement.style.display = 'none';
    var div = previewPhotoElement.cloneNode(true);
    var img = document.createElement('img');
    img.width = parseInt(style.width, 10);
    img.height = parseInt(style.height, 10);
    img.alt = 'Фотография жилья ' + countPhoto++;
    img.src = result;
    div.append(img);
    containerElement.append(div);
  }

  window.file.handlerReadMultiFiles(imagesElement, onFileRead);

  function reset() {
    // вернём фото аватара по умолчанию
    previewAvatarElement.src = previewAvatarImageDefault;

    // удалим все фотографии жилья
    document.querySelectorAll('.ad-form__photo:not(.' + CLASS_PHOTO_MAIN + ')')
    .forEach(function (it) {
      it.remove();
    });

    // вернём как было
    previewPhotoMainElement.style.display = 'block';

  }


  return {
    reset: reset,
  };

})();
