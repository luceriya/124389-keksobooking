'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin'); // div с шаблоном

  window.pinModule = {
    /**
     * создать метки
     * @param {array} offers массив с n-ым количеством объектов объявлений
     * @param {ELEMENT_NODE} mapPin template c разметкой метки
     * @return {object} нужная разметка
     */
    renderPin: function (offers, mapPin) {
      var pinElement = mapPin.cloneNode(true); // полностью клонировать шаблон

      pinElement.setAttribute('data-id', offers.id);
      pinElement.style = 'left: ' + (offers.location.x - PIN_WIDTH) + 'px; top: ' + (offers.location.y - PIN_HEIGHT) + 'px;';
      pinElement.querySelector('img').src = offers.author.avatar;
      pinElement.querySelector('img').alt = offers.offer.title;
      pinElement.addEventListener('click', window.mapModule.onPinClick);
      return pinElement;
    },

    mapPinTemplate: mapPinTemplate
  };


})();
